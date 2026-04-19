const MockInterview = require('../models/MockInterview');
const InterviewSession = require('../models/InterviewSession');
const { ensureUserProgress, recalculateProgress } = require('../utils/progressUtils');

const scoreResponse = (userResponse, expectedAnswer) => {
  const userWords = new Set(
    (userResponse || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
  const expectedWords = new Set(
    (expectedAnswer || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
  if (!expectedWords.size) return 0;

  let overlap = 0;
  for (const w of userWords) {
    if (expectedWords.has(w)) overlap += 1;
  }
  const score = Math.min(100, Math.round((overlap / expectedWords.size) * 100));
  return score;
};

exports.startMockInterview = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId is required' });

    const session = await InterviewSession.findOne({ _id: sessionId, user: req.user._id }).lean();
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const mock = await MockInterview.create({
      user: req.user._id,
      session: session._id,
      role: session.role,
      experience: session.experience,
      status: 'in_progress',
    });

    res.status(201).json(mock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitMockResponse = async (req, res) => {
  try {
    const { mockId, questionIndex, userResponse } = req.body;
    if (!mockId || questionIndex === undefined || !userResponse) {
      return res.status(400).json({ message: 'mockId, questionIndex and userResponse are required' });
    }

    const mock = await MockInterview.findOne({ _id: mockId, user: req.user._id });
    if (!mock) return res.status(404).json({ message: 'Mock interview not found' });
    if (mock.status === 'completed') {
      return res.status(400).json({ message: 'Mock interview already completed' });
    }

    const session = await InterviewSession.findOne({ _id: mock.session, user: req.user._id }).lean();
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const q = session.generatedQuestions[questionIndex];
    if (!q) return res.status(404).json({ message: 'Question not found' });

    const score = scoreResponse(userResponse, q.answer);
    const feedback =
      score >= 75
        ? 'Strong answer. Good overlap with expected interview points.'
        : score >= 45
          ? 'Decent answer. Add more technical depth and examples.'
          : 'Needs improvement. Include clearer structure and role-specific details.';

    const existingIdx = mock.responses.findIndex((r) => r.questionIndex === Number(questionIndex));
    const payload = {
      questionIndex: Number(questionIndex),
      question: q.question,
      expectedAnswer: q.answer,
      userResponse,
      score,
      feedback,
    };

    if (existingIdx >= 0) {
      mock.responses[existingIdx] = payload;
    } else {
      mock.responses.push(payload);
    }

    await mock.save();
    res.json(mock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeMockInterview = async (req, res) => {
  try {
    const { mockId } = req.body;
    if (!mockId) return res.status(400).json({ message: 'mockId is required' });

    const mock = await MockInterview.findOne({ _id: mockId, user: req.user._id });
    if (!mock) return res.status(404).json({ message: 'Mock interview not found' });

    const avg =
      mock.responses.length > 0
        ? Math.round(mock.responses.reduce((sum, r) => sum + r.score, 0) / mock.responses.length)
        : 0;

    mock.status = 'completed';
    mock.finalScore = avg;
    mock.completedAt = new Date();
    mock.summary =
      avg >= 75
        ? 'Excellent performance. Keep refining communication and real examples.'
        : avg >= 50
          ? 'Good progress. Focus on sharper structure and stronger technical keywords.'
          : 'Keep practicing. Use STAR format and role-specific concepts in answers.';
    await mock.save();

    const progress = await ensureUserProgress(req.user._id);
    progress.mockScores.push(avg);
    recalculateProgress(progress);
    await progress.save();

    res.json(mock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMockHistory = async (req, res) => {
  try {
    const history = await MockInterview.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

