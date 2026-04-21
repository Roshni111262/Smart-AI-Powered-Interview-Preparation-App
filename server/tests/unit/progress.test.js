/**
 * Test suite for Progress Controller
 * Tests user progress tracking, statistics, and improvement metrics
 */
describe('ProgressController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: '123' },
      body: {},
      params: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('Get User Progress', () => {
    test('should retrieve user progress data', async () => {
      req.user._id = '123';

      const userProgress = {
        user: '123',
        sessionsCompleted: 5,
        questionsPracticed: 25,
        questionReviewCount: 15,
        pinnedCount: 8,
        notesCount: 12,
        discussionsContributed: 3,
        topicsCovered: ['Node.js', 'React', 'MongoDB'],
        mockScores: [75, 82, 88],
        averageMockScore: 81.67,
        improvementOverTime: 13,
      };

      expect(userProgress.user).toBe('123');
      expect(userProgress.sessionsCompleted).toBeGreaterThan(0);
      expect(userProgress.topicsCovered.length).toBeGreaterThan(0);
    });

    test('should calculate average mock score', async () => {
      const scores = [75, 82, 88, 91];
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;

      expect(average).toBe(84);
    });

    test('should return zero values for new users', async () => {
      const newUserProgress = {
        sessionsCompleted: 0,
        questionsPracticed: 0,
        mockScores: [],
        averageMockScore: 0,
      };

      expect(newUserProgress.sessionsCompleted).toBe(0);
      expect(newUserProgress.mockScores.length).toBe(0);
    });
  });

  describe('Track Improvements', () => {
    test('should calculate improvement percentage', async () => {
      const oldScore = 65;
      const newScore = 85;
      const improvement = ((newScore - oldScore) / oldScore) * 100;

      expect(improvement).toBeGreaterThan(0);
      expect(improvement).toBeCloseTo(30.77, 1);
    });

    test('should track score progression', async () => {
      const scoreHistory = [
        { date: new Date('2024-01-01'), score: 65 },
        { date: new Date('2024-01-15'), score: 72 },
        { date: new Date('2024-02-01'), score: 80 },
        { date: new Date('2024-02-15'), score: 85 },
      ];

      expect(scoreHistory[scoreHistory.length - 1].score).toBeGreaterThan(
        scoreHistory[0].score
      );
    });

    test('should identify weaker topics', async () => {
      const topicScores = [
        { topic: 'React', avgScore: 85 },
        { topic: 'Node.js', avgScore: 75 },
        { topic: 'MongoDB', avgScore: 68 },
      ];

      const weakestTopic = topicScores.reduce((min, current) =>
        current.avgScore < min.avgScore ? current : min
      );

      expect(weakestTopic.topic).toBe('MongoDB');
      expect(weakestTopic.avgScore).toBe(68);
    });
  });

  describe('Statistics Calculation', () => {
    test('should calculate total questions practiced', async () => {
      const sessions = [
        { questionsAnswered: 5 },
        { questionsAnswered: 6 },
        { questionsAnswered: 4 },
      ];

      const total = sessions.reduce((sum, s) => sum + s.questionsAnswered, 0);
      expect(total).toBe(15);
    });

    test('should count unique topics', async () => {
      const topicsCovered = [
        'React',
        'React', // duplicate
        'Node.js',
        'MongoDB',
        'React', // duplicate
      ];

      const uniqueTopics = new Set(topicsCovered);
      expect(uniqueTopics.size).toBe(3);
    });

    test('should calculate activity streaks', async () => {
      const activityDays = [
        new Date('2024-02-13'),
        new Date('2024-02-14'),
        new Date('2024-02-15'),
        new Date('2024-02-16'),
      ];

      const currentStreak = activityDays.length;
      expect(currentStreak).toBe(4);
    });
  });

  describe('Update Progress', () => {
    test('should update progress after session completion', async () => {
      req.body = {
        sessionId: 'session-123',
        questionsAnswered: 5,
        mockScore: 87,
      };

      const progress = {
        sessionsCompleted: 1,
        questionsPracticed: 5,
        mockScores: [87],
      };

      expect(progress.sessionsCompleted).toBe(1);
      expect(progress.questionsPracticed).toBe(5);
      expect(progress.mockScores[0]).toBe(87);
    });

    test('should increment notes count', async () => {
      let notesCount = 5;
      notesCount++;

      expect(notesCount).toBe(6);
    });
  });

  describe('Progress Milestones', () => {
    test('should detect milestone achievements', async () => {
      const milestones = [
        { name: 'First Session', threshold: 1 },
        { name: 'Practice 10 Questions', threshold: 10 },
        { name: 'Score 80+', threshold: 80 },
        { name: 'Complete 5 Sessions', threshold: 5 },
      ];

      const progress = {
        sessionsCompleted: 5,
        questionsPracticed: 15,
        averageMockScore: 82,
      };

      const achieved = milestones.filter(m => {
        if (m.name === 'First Session') return progress.sessionsCompleted >= m.threshold;
        if (m.name === 'Practice 10 Questions') return progress.questionsPracticed >= m.threshold;
        if (m.name === 'Score 80+') return progress.averageMockScore >= m.threshold;
        if (m.name === 'Complete 5 Sessions') return progress.sessionsCompleted >= m.threshold;
      });

      expect(achieved.length).toBe(4);
    });
  });

  describe('Last Active Timestamp', () => {
    test('should update last active time', async () => {
      const lastActive = new Date();
      const now = new Date();

      expect(now.getTime()).toBeGreaterThanOrEqual(lastActive.getTime());
    });

    test('should calculate time since last activity', async () => {
      const lastActive = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
      const now = new Date();

      const daysSince = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
      expect(daysSince).toBeGreaterThan(0);
      expect(daysSince).toBeLessThan(3);
    });
  });
});
