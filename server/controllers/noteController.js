const Note = require('../models/Note');
const InterviewSession = require('../models/InterviewSession');
const UserProgress = require('../models/UserProgress');

exports.createNote = async (req, res) => {
  try {
    const { sessionId, questionIndex = -1, content } = req.body;
    if (!sessionId || !content) {
      return res.status(400).json({ message: 'sessionId and content are required' });
    }

    const session = await InterviewSession.findOne({
      _id: sessionId,
      user: req.user._id,
    });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const note = await Note.create({
      user: req.user._id,
      session: sessionId,
      questionIndex,
      content,
    });

    await UserProgress.findOneAndUpdate(
      { user: req.user._id },
      {
        $inc: { notesCount: 1 },
        updatedAt: new Date(),
        lastActiveAt: new Date(),
      },
      { upsert: true }
    );

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const { sessionId } = req.query;
    const query = { user: req.user._id };
    if (sessionId) query.session = sessionId;

    const notes = await Note.find(query).sort({ updatedAt: -1 }).lean();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'content is required' });

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { content },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    await UserProgress.findOneAndUpdate(
      { user: req.user._id },
      {
        $inc: { notesCount: -1 },
        updatedAt: new Date(),
        lastActiveAt: new Date(),
      },
      { upsert: true }
    );

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

