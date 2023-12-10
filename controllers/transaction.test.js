
const { getTransaction,setTransaction } = require('./transactionController'); 
const Transaction = require('../models/transactionModel'); 
const Child = require('../models/childModel');
const {createNotification} = require('./requestTaskController');
jest.mock('../models/transactionModel');
jest.mock('../models/childModel');
jest.mock('./requestTaskController');


describe('getTransaction function', () => {
  it('should return an array of transactions with a 200 status', async () => {
    const mockTransactions = [
      { _id: 'transactionId1', amount: 100, description: 'Transaction 1' },
      { _id: 'transactionId2', amount: 200, description: 'Transaction 2' },
    ];

    Transaction.find.mockResolvedValue(mockTransactions);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(mockTransactions);
  });

  it('should handle errors and return a 400 status with an error message', async () => {
    Transaction.find.mockRejectedValue(new Error('Mocked error'));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({ error: 'Mocked error' });
  });
});

describe('setTransaction function', () => {
    it('should create a transaction and update child accounts with a 200 status', async () => {
      const mockChildSender = {
        _id: 'senderId',
        name: 'Sender Child',
        currentAccount: 500,
      };
  
      const mockChildReceiver = {
        _id: 'receiverId',
        name: 'Receiver Child',
        currentAccount: 200,
      };

      Child.findOneAndUpdate.mockResolvedValue(mockChildSender);
      Child.findById.mockResolvedValue(mockChildSender); 
  
      createNotification.mockResolvedValue('Notification sent successfully');
  
      const mockTransaction = {
        _id: 'transactionId',
        sender: 'senderId',
        receiver: 'receiverId',
        amount: 100,
      };
  
      Transaction.create.mockResolvedValue(mockTransaction);
  
      const req = {
        body: {
          sender: 'senderId',
          receiver: 'receiverId',
          amount: 100,
        },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await setTransaction(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
  
      expect(res.json).toHaveBeenCalledWith(mockTransaction);
  
      expect(Child.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'senderId' },
        { $inc: { currentAccount: -100 } }
      );
  
      expect(Child.findById).toHaveBeenCalledWith('senderId');
  
      expect(Child.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: 'receiverId' },
        { $inc: { currentAccount: 100 } }
      );
  
      expect(createNotification).toHaveBeenCalledWith({
        title: 'اخوتي',
        body: `حوالة واردة من Sender Child`, 
        user: 'receiverId',
      });
  
      expect(Transaction.create).toHaveBeenCalledWith({
        sender: 'senderId',
        receiver: 'receiverId',
        amount: 100,
      });
    });
  
    it('should handle missing fields and return a 400 status with an error message', async () => {
      const req = {
        body: {
          sender: 'senderId',
        },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await setTransaction(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith({ error: 'Please provide all required fields' });
    });
  
    it('should handle errors and return a 400 status with an error message', async () => {
      Child.findOneAndUpdate.mockRejectedValue(new Error('Mocked error'));
  
      const req = {
        body: {
          sender: 'senderId',
          receiver: 'receiverId',
          amount: 100,
        },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await setTransaction(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
  
      expect(res.json).toHaveBeenCalledWith({ error: 'Mocked error' });
    });
  });