require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const shareRoutes = require('./routes/shareRoutes');
const progressRoutes = require('./routes/progressRoutes');
const noteRoutes = require('./routes/noteRoutes');
const mockRoutes = require('./routes/mockRoutes');
const sessionsRoutes = require('./routes/sessionsRoutes');
const questionsRoutes = require('./routes/questionsRoutes');
const explanationRoutes = require('./routes/explanationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const theaterRoutes = require('./routes/theaterRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { ensureDefaultUsers } = require('./utils/bootstrapDefaults');

connectDB().then(async () => {
  await ensureDefaultUsers();
});

const app = express();

app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/explanations', explanationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/mock', mockRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
