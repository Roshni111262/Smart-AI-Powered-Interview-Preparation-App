const InterviewSession = require('../models/InterviewSession');
const UserProgress = require('../models/UserProgress');
const { generateInterviewQuestions, generateExplanation } = require('../services/geminiService');

exports.createSession = async (req, res) => {
  try {
    const { role, experience } = req.body;

    if (!role || !experience) {
      return res.status(400).json({ message: 'Role and experience are required' });
    }

    const questionsData = await generateInterviewQuestions(role, experience);

    const session = await InterviewSession.create({
      user: req.user._id,
      role,
      experience,
      generatedQuestions: questionsData,
    });

    const qCount = questionsData.length;
    await UserProgress.findOneAndUpdate(
      { user: req.user._id },
      {
        $inc: { sessionsCompleted: 1, questionsPracticed: qCount },
        lastActiveAt: new Date(),
        updatedAt: new Date(),
      },
      { upsert: true }
    );

    res.status(201).json(session);
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ message: error.message || 'Failed to create session' });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.togglePinQuestion = async (req, res) => {
  try {
    const { sessionId, questionIndex } = req.body;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const question = session.generatedQuestions[questionIndex];
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const wasPinned = question.isPinned;
    question.isPinned = !question.isPinned;
    await session.save();

    await UserProgress.findOneAndUpdate(
      { user: req.user._id },
      {
        $inc: { pinnedCount: wasPinned ? -1 : 1 },
        updatedAt: new Date(),
        lastActiveAt: new Date(),
      },
      { upsert: true }
    );

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.explainQuestion = async (req, res) => {
  try {
    const { question, role, experience, sessionId, questionIndex, saveToSession } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const safeRole = role || 'Software Engineer';
    const safeExperience = experience || 'Intermediate';

    const explanation = await generateExplanation(question, safeRole, safeExperience);

    if (saveToSession && sessionId !== undefined && questionIndex !== undefined) {
      const session = await InterviewSession.findOne({
        _id: sessionId,
        user: req.user._id,
      });
      if (session && session.generatedQuestions[questionIndex]) {
        session.generatedQuestions[questionIndex].explanation = explanation;
        await session.save();
      }
    }

    res.json({ explanation });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to generate explanation' });
  }
};

exports.getQuestionByIndex = async (req, res) => {
  try {
    const { sessionId, questionIndex } = req.params;
    const qIdx = Number(questionIndex);
    const session = await InterviewSession.findOne({
      _id: sessionId,
      user: req.user._id,
    });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    const question = session.generatedQuestions[qIdx];
    if (!question) return res.status(404).json({ message: 'Question not found' });

    session.reviewCount += 1;
    await session.save();

    await UserProgress.findOneAndUpdate(
      { user: req.user._id },
      {
        $inc: { questionReviewCount: 1 },
        updatedAt: new Date(),
        lastActiveAt: new Date(),
      },
      { upsert: true }
    );

    res.json({
      sessionId: session._id,
      role: session.role,
      experience: session.experience,
      questionIndex: qIdx,
      question,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
