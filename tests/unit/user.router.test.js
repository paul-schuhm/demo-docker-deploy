const request = require('supertest');
const express = require('express');

const { createUserRouter } = require('../../src/resources/users.js');

//Test unitaire (sateless)

describe('GET /users', () => {
  test('returns users from service', async () => {
    const mockUsers = [
      { id: 1, first_name: 'John' },
      { id: 2, first_name: 'Jane' }
    ];

    const service = {
      users: jest.fn().mockResolvedValue(mockUsers)
    };

    const app = express();
    app.use(createUserRouter(service));

    const res = await request(app).get('/users');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockUsers);
    expect(service.users).toHaveBeenCalledTimes(1);
  });
});