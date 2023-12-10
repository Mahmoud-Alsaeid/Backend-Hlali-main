const {loginUser, registerUser, getUser, deleteUser,newpass, sendcode, configcode} = require('./userController');
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


describe('getUser function', () => {
  it('should return users with populated requestTask and Task', async () => {
    const mockUsers = [
      {
        _id: 'user1',
        name: 'User 1',
        requestTask: { _id: 'task1', title: 'Task 1' },
        Task: { _id: 'task2', title: 'Task 2' },
      },
    ];

    User.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUsers),
      }),
    });
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });
});

describe('deleteUser function', () => {
  it('should delete a user and return the user id', async () => {
    const mockUser = {
      _id: 'userId',
      name: 'Test User',
      email: 'test@example.com',
      // Add other fields as needed
    };

    // Mocking the findById method to resolve with the mockUser
    User.findById.mockResolvedValue(mockUser);

    // Mocking the findOneAndDelete method to resolve with the deleted user
    User.findOneAndDelete.mockResolvedValue(mockUser);

    const req = {
      params: { id: 'userId' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUser(req, res);

    // Expect status to be 200
    expect(res.status).toHaveBeenCalledWith(200);

    // Expect json to be called with the user id
    expect(res.json).toHaveBeenCalledWith({ id: 'userId' });
  });

  it('should handle errors and return a 400 status with an error message', async () => {
    // Mocking the findById method to reject with an error
    User.findById.mockRejectedValue(new Error('Mocked error'));

    const req = {
      params: { id: 'userId' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUser(req, res);

    // Expect status to be 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Expect json to be called with an error message
    expect(res.json).toHaveBeenCalledWith({ error: 'Mocked error' });
  });
});

const sendmail = require('../Utils/sendMailer'); // Update with the correct path to your sendmail module
const nodemailer = require('nodemailer');
jest.mock('nodemailer');

describe('sendmail module', () => {
  it('should send an email with the provided code', async () => {
    const mockSendMailResponse = 'Email sent successfully';

    // Mocking the createTransport and sendMail methods
    nodemailer.createTransport.mockReturnValue({
      sendMail: jest.fn().mockResolvedValue(mockSendMailResponse),
    });
    User.findOneAndUpdate.mockResolvedValue()
    const email = 'test@example.com';
    const result = await sendmail(email);

    // Expect createTransport to be called with the correct configuration
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: 'keetup.agency@gmail.com',
        pass: 'Keetup@2023',
      },
    });

    // Expect sendMail to be called with the correct parameters
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith({
      from: 'keetup.agency@gmail.com',
      to: email,
      subject: 'forget password',
      text: ' your code ',
      html: '<b>123456</b>', // Assuming the code is hardcoded as 123456
    });

    // Expect the result to be the mockSendMailResponse
    expect(result).toBe(mockSendMailResponse);
  });

  // Add more test cases if needed
});


describe('sendcode function', () => {

  it('should handle user not found and return a 404 status with an error message', async () => {
    // Mocking the findOne method to resolve with null (user not found)
    User.findOne.mockResolvedValue(null);

    const req = {
      body: { email: 'nonexistent@example.com' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    await sendcode(req, res);

    // Expect status to be called with 404
    expect(res.status).toHaveBeenCalledWith(404);

    // Expect send to be called with "not email1"
    expect(res.send).toHaveBeenCalledWith('not email1');
  });

  it('should handle errors and return a 400 status with an error message', async () => {
    // Mocking the findOne method to reject with an error
    User.findOne.mockRejectedValue(new Error('Mocked error'));

    const req = {
      body: { email: 'test@example.com' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    await sendcode(req, res);

    // Expect status to be called with 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Expect json to be called with an error message
    expect(res.json).toHaveBeenCalledWith({ error: 'Mocked error' });
  });
});



describe('configcode function', () => {
  it('should return "good code" if the provided code matches the user code', async () => {
    const mockUser = {
      _id: 'userId',
      email: 'test@example.com',
      code: '123456', // Assuming the user code is hardcoded as 123456
    };

    // Mocking the findOne method to resolve with the mockUser
    User.findOne.mockResolvedValue(mockUser);

    const req = {
      body: {
        email: 'test@example.com',
        code: '123456', // Assuming the provided code matches the user code
      },
    };

    const res = {
      send: jest.fn(),
    };

    await configcode(req, res);

    // Expect send to be called with "good code"
    expect(res.send).toHaveBeenCalledWith('good code');
  });

  it('should return "not good code" if the provided code does not match the user code', async () => {
    const mockUser = {
      _id: 'userId',
      email: 'test@example.com',
      code: '123456', // Assuming the user code is hardcoded as 123456
    };

    // Mocking the findOne method to resolve with the mockUser
    User.findOne.mockResolvedValue(mockUser);

    const req = {
      body: {
        email: 'test@example.com',
        code: '654321', // Assuming the provided code does not match the user code
      },
    };

    const res = {
      send: jest.fn(),
    };

    await configcode(req, res);

    // Expect send to be called with "not good code"
    expect(res.send).toHaveBeenCalledWith('not good code');
  });

  it('should handle errors and return a 400 status with an error message', async () => {
    // Mocking the findOne method to reject with an error
    User.findOne.mockRejectedValue(new Error('Mocked error'));

    const req = {
      body: {
        email: 'test@example.com',
        code: '123456', // Assuming the provided code matches the user code
      },
    };

    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await configcode(req, res);

    // Expect status to be called with 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Expect json to be called with an error message
    expect(res.json).toHaveBeenCalledWith({ error: 'Mocked error' });
  });
});

describe('newpass function', () => {
  it('should update the user password and return "good new password"', async () => {
    const mockUser = {
      _id: 'userId',
      email: 'test@example.com',
    };

    // Mocking the findOne method to resolve with the mockUser
    User.findOne.mockResolvedValue(mockUser);

    // Mocking the hashSync method to return a hashed password
    bcrypt.hashSync.mockReturnValue('hashedPassword');

    const req = {
      body: {
        email: 'test@example.com',
        password: 'newPassword123', // Assuming a valid password
      },
    };

    const res = {
      send: jest.fn(),
    };

    await newpass(req, res);

    // Expect findOne to be called with the correct parameters
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });

    // Expect hashSync to be called with the correct password and salt rounds
    expect(bcrypt.hashSync).toHaveBeenCalledWith('newPassword123', 10);

    // Expect findByIdAndUpdate to be called with the correct parameters
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('userId', {
      password: 'hashedPassword',
    });

    // Expect send to be called with "good new password"
    expect(res.send).toHaveBeenCalledWith('good new passowrd');
  });

  it('should handle user not found and return a 404 status with an error message', async () => {
    // Mocking the findOne method to resolve with null (user not found)
    User.findOne.mockResolvedValue(null);

    const req = {
      body: {
        email: 'nonexistent@example.com',
        password: 'newPassword123', // Assuming a valid password
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await newpass(req, res);

    // Expect status to be called with 404
    expect(res.status).toHaveBeenCalledWith(404);

    // Expect send to be called with "not email1"
    expect(res.send).toHaveBeenCalledWith('not email1');
  });

  it('should handle invalid password and return a 404 status with an error message', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'short', // Assuming an invalid short password
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    User.findOne.mockResolvedValue({email: 'sds'})
    await newpass(req, res);

    // Expect status to be called with 404
    expect(res.status).toHaveBeenCalledWith(404);

    // Expect send to be called with "not password"
    expect(res.send).toHaveBeenCalledWith('not password');
  });

  it('should handle errors and return a 400 status with an error message', async () => {
    // Mocking the findOne method to reject with an error
    User.findOne.mockRejectedValue(new Error('Mocked error'));

    const req = {
      body: {
        email: 'test@example.com',
        password: 'newPassword123', // Assuming a valid password
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await newpass(req, res);

    // Expect status to be called with 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Expect json to be called with an error message
    expect(res.json).toHaveBeenCalledWith({ error: 'Mocked error' });
  });
});

