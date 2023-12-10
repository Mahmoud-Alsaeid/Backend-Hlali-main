const { getRequestTask,setRequestTask } = require('./requestTaskController'); 
const RequestTask = require('../models/requestTask'); 

jest.mock('../models/requestTask');

describe('getRequestTask function', () => {
  it('should return an array of RequestTasks with a 200 status', async () => {
    const mockRequestTasks = [
      { _id: 'task1', parentId: 'parentId', childId: { _id: 'childId1', name: 'Child 1', gender: 'Male' } },
      { _id: 'task2', parentId: 'parentId', childId: { _id: 'childId2', name: 'Child 2', gender: 'Female' } },
    ];

    RequestTask.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockRequestTasks)
    });

    const req = {
      user: { id: 'parentId' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getRequestTask(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(mockRequestTasks);

    expect(RequestTask.find).toHaveBeenCalledWith({ parentId: 'parentId' });
  });

});

