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

  test('GET /healthz returns ok', async () => {
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('ok');
  });

  test('GET / returns API info', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('endpoints');
  });
});

describe('Yacht endpoints', () => {
  test('GET /yachts returns yacht list', async () => {
    const res = await request(app).get('/yachts');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /yachts/:id returns specific yacht', async () => {
    const res = await request(app).get('/yachts/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('id', 1);
  });

  test('POST /yachts creates new yacht', async () => {
    const res = await request(app)
      .post('/yachts')
      .send({
        name: "Test Yacht",
        type: "Motor Yacht",
        length: 100,
        capacity: 20
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('name', "Test Yacht");
  });
});

describe('Analytics endpoints', () => {
  test('GET /analytics/dashboard returns dashboard data', async () => {
    const res = await request(app).get('/analytics/dashboard');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('fleet');
    expect(res.body.data).toHaveProperty('crew');
    expect(res.body.data).toHaveProperty('bookings');
  });

  test('GET /analytics/fleet-overview returns fleet data', async () => {
    const res = await request(app).get('/analytics/fleet-overview');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('totalYachts');
  });
});
