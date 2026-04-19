require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const InterviewSession = require('../models/InterviewSession');
const Note = require('../models/Note');
const Discussion = require('../models/Discussion');
const UserProgress = require('../models/UserProgress');
const MockInterview = require('../models/MockInterview');
const Payment = require('../models/Payment');
const Ticket = require('../models/Ticket');
const Theater = require('../models/Theater');
const Movie = require('../models/Movie');

const DEMO_PASSWORD = 'Password@123';

const makeQuestions = (role) => [
  {
    question: `Explain event loop in ${role}.`,
    answer: 'Event loop processes callbacks from task queues after call stack is empty.',
    explanation: 'Interviewer checks your async runtime understanding and practical debugging ability.',
    isPinned: true,
  },
  {
    question: `How do you optimize API performance in ${role}?`,
    answer: 'Use caching, indexing, pagination, query optimization, and profiling.',
    explanation: 'Focus on measurable bottlenecks and tradeoffs.',
    isPinned: false,
  },
  {
    question: `Describe a production incident you handled.`,
    answer: 'Explain detection, mitigation, root cause analysis, and prevention steps.',
    explanation: 'Use STAR format and include outcomes.',
    isPinned: true,
  },
];

const runSeed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    InterviewSession.deleteMany({}),
    Note.deleteMany({}),
    Discussion.deleteMany({}),
    UserProgress.deleteMany({}),
    MockInterview.deleteMany({}),
    Payment.deleteMany({}),
    Ticket.deleteMany({}),
    Theater.deleteMany({}),
    Movie.deleteMany({}),
  ]);

  const hash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const users = await User.insertMany([
    {
      name: 'Demo User',
      email: 'demo@example.com',
      password: hash,
      subscription: { plan: 'premium', status: 'active', expiresAt: new Date(Date.now() + 86400000 * 30) },
    },
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hash,
      role: 'admin',
      subscription: { plan: 'premium', status: 'active', expiresAt: new Date(Date.now() + 86400000 * 30) },
    },
    { name: 'Riya Sharma', email: 'riya@example.com', password: hash },
    { name: 'Aman Verma', email: 'aman@example.com', password: hash },
  ]);

  const [demoUser, adminUser, user2, user3] = users;

  const session1 = await InterviewSession.create({
    user: demoUser._id,
    role: 'MERN Stack Developer',
    experience: 'Intermediate',
    generatedQuestions: makeQuestions('MERN Stack Developer'),
    reviewCount: 7,
  });

  const session2 = await InterviewSession.create({
    user: demoUser._id,
    role: 'Backend Engineer',
    experience: 'Advanced',
    generatedQuestions: makeQuestions('Backend Engineer'),
    reviewCount: 4,
  });

  const session3 = await InterviewSession.create({
    user: user2._id,
    role: 'Frontend Developer',
    experience: 'Intermediate',
    generatedQuestions: makeQuestions('Frontend Developer'),
    reviewCount: 5,
  });

  await Note.insertMany([
    {
      user: demoUser._id,
      session: session1._id,
      questionIndex: 0,
      content: 'Mention call stack, macro/micro tasks, and practical debugging example.',
    },
    {
      user: demoUser._id,
      session: session2._id,
      questionIndex: 2,
      content: 'Use STAR. Include monitoring alerts and postmortem action item.',
    },
  ]);

  await Discussion.insertMany([
    {
      user: demoUser._id,
      userName: demoUser.name,
      title: 'Best way to answer system design intro question?',
      content: 'How do you structure the first 2 minutes in system design interviews?',
      sessionRef: session2._id,
      questionRef: 'Q1',
      replies: [
        {
          user: user2._id,
          userName: user2.name,
          content: 'Clarify requirements first, then high-level architecture and tradeoffs.',
        },
      ],
    },
    {
      user: user3._id,
      userName: user3.name,
      title: 'How much depth is enough for event loop?',
      content: 'Should we explain microtask queue details every time?',
      sessionRef: session1._id,
      questionRef: 'Q2',
      replies: [
        {
          user: demoUser._id,
          userName: demoUser.name,
          content: 'Only if role is JS-heavy; otherwise keep concise and practical.',
        },
      ],
    },
  ]);

  await MockInterview.insertMany([
    {
      user: demoUser._id,
      session: session1._id,
      role: session1.role,
      experience: session1.experience,
      status: 'completed',
      responses: [
        {
          questionIndex: 0,
          question: session1.generatedQuestions[0].question,
          expectedAnswer: session1.generatedQuestions[0].answer,
          userResponse: 'I explained call stack and microtasks with Node timers example.',
          score: 78,
          feedback: 'Good answer with practical context.',
        },
      ],
      finalScore: 78,
      summary: 'Strong baseline performance.',
      startedAt: new Date(),
      completedAt: new Date(),
    },
  ]);

  const [payment1, payment2] = await Payment.insertMany([
    {
      user: demoUser._id,
      gateway: 'khalti',
      amount: 1499,
      currency: 'NPR',
      status: 'paid',
      subscriptionPlan: 'premium',
      providerTransactionId: 'KHLT-DEMO-1001',
      paidAt: new Date(),
    },
    {
      user: user2._id,
      gateway: 'stripe',
      amount: 999,
      currency: 'NPR',
      status: 'failed',
      subscriptionPlan: 'premium',
      providerTransactionId: 'STRP-DEMO-1002',
    },
  ]);

  await Ticket.insertMany([
    {
      user: demoUser._id,
      payment: payment1._id,
      ticketId: `TKT-${Date.now()}-1001`,
      paymentStatus: 'paid',
      featuresAccessed: ['Mock Interview', 'Advanced Analytics', 'AI Deep Explanations'],
    },
    {
      user: user2._id,
      payment: payment2._id,
      ticketId: `TKT-${Date.now()}-1002`,
      paymentStatus: 'failed',
      featuresAccessed: ['Subscription Checkout'],
    },
  ]);

  const theaters = await Theater.insertMany([
    {
      name: 'Theater One',
      cityHall: 'Kathmandu City Hall',
      location: 'Kathmandu',
      showtimes: [
        { movieTitle: 'City Hall Movie', startsAt: new Date(), capacity: 120, paidSeats: 100 },
        { movieTitle: 'AI Rising', startsAt: new Date(), capacity: 80, paidSeats: 65 },
      ],
    },
    {
      name: 'Theater Two',
      cityHall: 'Pokhara City Hall',
      location: 'Pokhara',
      showtimes: [
        { movieTitle: 'City Hall Movie', startsAt: new Date(), capacity: 100, paidSeats: 70 },
      ],
    },
    {
      name: 'Theater Three',
      cityHall: 'Biratnagar City Hall',
      location: 'Biratnagar',
      showtimes: [
        { movieTitle: 'City Hall Movie', startsAt: new Date(), capacity: 90, paidSeats: 86 },
      ],
    },
  ]);

  await Movie.insertMany([
    {
      title: 'City Hall Movie',
      description: 'A feature film listed per theater city hall with showtime mapping.',
      durationMinutes: 126,
      genre: ['Drama', 'Action'],
      theaterRefs: theaters.map((t) => t._id),
    },
  ]);

  await UserProgress.insertMany([
    {
      user: demoUser._id,
      sessionsCompleted: 2,
      questionsPracticed: 6,
      questionReviewCount: 11,
      pinnedCount: 4,
      notesCount: 2,
      discussionsContributed: 2,
      topicsCovered: ['Node.js', 'MongoDB', 'System Design'],
      mockScores: [65, 78],
      averageMockScore: 71.5,
      improvementOverTime: 13,
      lastActiveAt: new Date(),
      updatedAt: new Date(),
    },
    {
      user: user2._id,
      sessionsCompleted: 1,
      questionsPracticed: 3,
      questionReviewCount: 5,
      pinnedCount: 1,
      notesCount: 1,
      discussionsContributed: 1,
      topicsCovered: ['React', 'Performance'],
      mockScores: [70],
      averageMockScore: 70,
      improvementOverTime: 0,
      lastActiveAt: new Date(),
      updatedAt: new Date(),
    },
    {
      user: user3._id,
      sessionsCompleted: 0,
      questionsPracticed: 0,
      questionReviewCount: 2,
      pinnedCount: 0,
      notesCount: 0,
      discussionsContributed: 1,
      topicsCovered: ['Interview Communication'],
      mockScores: [62],
      averageMockScore: 62,
      improvementOverTime: 0,
      lastActiveAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  console.log('Seed complete.');
  console.log('Demo login: demo@example.com / Password@123');
  console.log('Admin login: admin@example.com / Password@123');

  await mongoose.disconnect();
};

runSeed().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});

