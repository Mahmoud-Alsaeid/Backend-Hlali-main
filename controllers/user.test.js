const {loginUser, registerUser} = require('./userController');
const User = require('../models/userModel');

const bcrypt = require('bcryptjs');

jest.mock('../models/userModel'); // Mock the User model
jest.mock('bcryptjs');

beforeEach(() => {
    process.env.JWT_SECRET = 'your-test-secret'; 
  });
  afterEach(() => {
    delete process.env.JWT_SECRET;
  });
describe('loginUser', () => {
  it('should login a user with valid credentials', async () => {
    const mockUser = {
      _id: 'mockUserId',
      id: 'mockUserId',
      name: 'Mock User',
      email: 'mockuser@example.com'
    };

    User.findOne.mockResolvedValue(mockUser);


    const req = {
      body: {
        email: 'mockuser@example.com',
        password: 'password123',
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    bcrypt.compare.mockResolvedValue(true);

    await loginUser(req, res);

    expect(res.json).toHaveBeenCalledWith({
      _id: mockUser._id,
      name: mockUser.name,
      email: mockUser.email,
      token: expect.any(String), 
    });
  });

  it('should handle invalid credentials', async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.compare.mockResolvedValue(false);

    const req = {
      body: {
        email: 'nonexistentuser@example.com',
        password: 'invalidpassword',
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });

  it('should handle errors during login', async () => {
    User.findOne.mockRejectedValue(new Error('Database error'));

    const req = {
      body: {
        email: 'mockuser@example.com',
        password: 'password123',
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
  });
});

describe('registerUser', () => {
  it('should register a new user', async () => {
    const mockUser = {
      _id: 'mockUserId',
      id: 'mockUserId',
      name: 'Mock User',
      email: 'mockuser@example.com',
    };

    User.findOne.mockResolvedValue(null); // No existing user with the same email
    bcrypt.genSalt.mockResolvedValue('mockSalt');
    bcrypt.hash.mockResolvedValue('mockHash');
    User.create.mockResolvedValue(mockUser);

    const req = {
      body: {
        name: 'Mock User',
        email: 'mockuser@example.com',
        password: 'password123',
        gender: 'male',
        code: '12345',
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: mockUser._id,
      name: mockUser.name,
      email: mockUser.email,
      token: expect.any(String),
    });
  });

  it('should handle existing user', async () => {
    const req = {
      body: {
        name: 'Existing User',
        email: 'existinguser@example.com',
        password: 'password123',
      },
    };

    User.findOne.mockResolvedValue({}); // Existing user with the same email

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
  });

  it('should handle missing fields', async () => {
    const req = {
      body: {
        name: 'Missing Fields User',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Please add all fields' });
  });


  it('should handle error during registration', async () => {
    const req = {
      body: {
        name: 'Error User',
        email: 'erroruser@example.com',
        password: 'password123',
      },
    };

    User.findOne.mockResolvedValue(null);
    bcrypt.genSalt.mockResolvedValue('mockSalt');
    bcrypt.hash.mockResolvedValue('mockHash');
    User.create.mockRejectedValue(new Error('Database error'));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
  });
});
