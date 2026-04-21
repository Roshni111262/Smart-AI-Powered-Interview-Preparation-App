// Test setup and global configurations
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key';
  process.env.MONGO_URI = 'mongodb://localhost:27017/smart-ai-test';
});

afterEach(() => {
  jest.clearAllMocks();
});

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));
