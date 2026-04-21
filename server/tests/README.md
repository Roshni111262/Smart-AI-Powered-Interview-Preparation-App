# Testing Documentation

## Overview
This project includes comprehensive unit testing for 10 key features using Jest. All tests are organized in a separate `tests` folder with individual test files for each feature.

## Test Structure

```
server/
├── tests/
│   ├── setup.js                    # Global test configuration
│   └── unit/
│       ├── auth.test.js            # Authentication tests
│       ├── interview.test.js        # Interview Sessions tests
│       ├── mock-interview.test.js   # Mock Interview tests
│       ├── notes.test.js            # Notes management tests
│       ├── discussion.test.js       # Discussions tests
│       ├── leaderboard.test.js      # Leaderboard tests
│       ├── payments.test.js         # Payments tests
│       ├── share.test.js            # Shareable Links tests
│       ├── progress.test.js         # Progress Tracking tests
│       └── admin.test.js            # Admin Dashboard tests
├── jest.config.js                  # Jest configuration
└── package.json                    # Updated with test scripts
```

## Test Files Description

### 1. **auth.test.js** - Authentication Tests
Tests user registration, login, and JWT token validation
- User registration with valid credentials
- Email and password validation
- JWT token format validation
- Login error handling

### 2. **interview.test.js** - Interview Sessions Tests
Tests interview session creation and management
- Create new interview sessions
- Retrieve sessions by ID
- Update session data
- Delete sessions
- Question generation validation

### 3. **mock-interview.test.js** - Mock Interview Tests
Tests mock interview workflow
- Start mock interview
- Submit responses
- Score calculation and feedback
- Complete interview and store summary
- Interview history tracking

### 4. **notes.test.js** - Notes Management Tests
Tests note creation, retrieval, and management
- Create notes for questions
- Retrieve notes by session
- Update note content
- Delete notes
- Note validation and length limits

### 5. **discussion.test.js** - Peer Discussion Tests
Tests discussion threads and replies
- Create discussion threads
- Add replies to discussions
- Update discussion content
- Delete discussions
- Discussion search functionality

### 6. **leaderboard.test.js** - Leaderboard Tests
Tests ranking and leaderboard functionality
- Global leaderboard ranking
- Ranking calculation
- Filter by role
- User rank retrieval
- Top performers list

### 7. **payments.test.js** - Payment Tests
Tests payment processing
- Create payment intent
- Confirm payment
- Subscription expiry management
- Payment validation
- Revenue tracking

### 8. **share.test.js** - Shareable Links Tests
Tests content sharing functionality
- Generate shareable tokens
- Retrieve shared content
- Link expiry validation
- Share analytics and view tracking
- Token security

### 9. **progress.test.js** - Progress Tracking Tests
Tests user progress and statistics
- Retrieve user progress data
- Calculate improvement metrics
- Topic-specific statistics
- Activity streak tracking
- Milestone achievements

### 10. **admin.test.js** - Admin Dashboard Tests
Tests admin functionality
- Dashboard overview statistics
- User management (block/delete)
- Payment analytics
- Discussion moderation
- System health monitoring
- Reporting and data export

## Installation

### 1. Install Jest and Testing Dependencies
```bash
cd server
npm install
```

Jest and testing dependencies are already listed in `package.json`:
- `jest` - Testing framework
- `supertest` - HTTP assertion library

### 2. Verify Installation
```bash
npm test -- --version
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test -- tests/unit/auth.test.js
```

## Test Output

When you run tests, you'll see output like:
```
PASS  tests/unit/auth.test.js
  AuthController
    User Registration
      ✓ should register a new user with valid credentials (5ms)
      ✓ should reject registration with missing email (2ms)
      ✓ should reject registration with weak password (1ms)
    User Login
      ✓ should login user with correct credentials (3ms)
      ✓ should reject login with invalid email (2ms)
      ✓ should return JWT token on successful login (2ms)
    ...

Test Suites: 10 passed, 10 total
Tests:       100+ passed, 100+ total
Snapshots:   0 total
Time:        5.234s
```

## Coverage Report

To generate a detailed coverage report:
```bash
npm run test:coverage
```

This creates a `coverage/` folder with:
- `lcov-report/index.html` - Visual coverage report (open in browser)
- `coverage.json` - Machine-readable coverage data
- Text summary in console

## Configuration

### Jest Configuration (`jest.config.js`)
- **Test Environment**: Node.js
- **Test Pattern**: `**/tests/unit/**/*.test.js`
- **Coverage Paths**: Controllers, models, routes, middleware
- **Timeout**: 10 seconds per test
- **Setup File**: `tests/setup.js`

### Setup File (`tests/setup.js`)
- Configures test environment variables
- Sets up global mocks
- Clears mocks after each test

## Writing New Tests

### Basic Test Structure
```javascript
describe('Feature Name', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, user: { _id: '123' }, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  test('should do something', () => {
    // Test logic
    expect(result).toBe(expectedValue);
  });
});
```

### Common Assertions
```javascript
expect(value).toBe(expectedValue);           // Exact equality
expect(value).toEqual(expectedValue);        // Deep equality
expect(value).toBeDefined();                 // Not undefined
expect(value).toBeTruthy();                  // Truthy value
expect(value).toBeGreaterThan(5);           // Greater than
expect(array).toContain(element);           // Array contains
expect(fn).toThrow();                       // Function throws error
```

## Best Practices

1. **One Concept Per Test**: Each test should verify one behavior
2. **Clear Test Names**: Use descriptive names that explain what is being tested
3. **Arrange-Act-Assert**: Structure tests with setup, action, and verification
4. **Mock External Dependencies**: Mock database, APIs, and external services
5. **Avoid Test Interdependencies**: Tests should be independent
6. **Use beforeEach**: Initialize common test data before each test

## Continuous Integration

To run tests in CI/CD pipeline (e.g., GitHub Actions):
```yaml
- name: Run Tests
  run: npm test -- --coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

## Troubleshooting

### Tests Not Found
```bash
npm test -- --listTests
```

### Clear Jest Cache
```bash
npm test -- --clearCache
```

### Debug Tests
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Next Steps

1. Run `npm test` to verify all tests pass
2. Add more specific tests as you implement features
3. Aim for >80% code coverage
4. Run tests before committing code
5. Integrate tests into your CI/CD pipeline

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
