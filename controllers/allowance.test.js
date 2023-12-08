const cron = require('node-cron');
const Child  = require('../models/childModel'); 

jest.mock('../models/childModel', () => ({
    findOneAndUpdate: jest.fn(),
}))

jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));


const {fromFather, cache} = require('./transactionController'); 

describe('fromFather', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should schedule a new transaction and update the cache', async () => {
    const parentId = 'parentId';
    const childId = 'childId';
    const day = 5;
    const amount = 100;
    Child.findOneAndUpdate.mockResolvedValue({ currentAccount: 200 });

    cron.schedule.mockImplementationOnce((_, callback) => {
      // Simulate running the scheduled job immediately
      callback();
      return {
        stop: jest.fn(),
      };
    });

    const req = {
      params: {
        id: childId,
      },
      body: {
        amount,
        day,
      },
      user: {
        id: parentId,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await fromFather(req, res);
    
    expect(cron.schedule).toHaveBeenCalledWith(`0 0 ${day} * *`, expect.any(Function));
    expect(cache[`${parentId}_${childId}`]).toBeDefined();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: `Transaction scheduled for day ${day}` });
  });
});
