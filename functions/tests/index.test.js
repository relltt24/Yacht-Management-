const request = require('supertest');
const { app } = require('../index');

describe('Functions basic tests', () => {
  test('express app loads', async () => {
    expect(typeof app).toBe('function');
  });

  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('ok', true);
  });
});
