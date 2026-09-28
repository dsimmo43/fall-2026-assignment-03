import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';
import { a } from 'vitest/dist/suite-dWqIFb_-.js';

describe('Part 1: API Integration Tests', () => {
  // TODO: Student implementation - Part 1: Integration Testing

  // Test user creation (POST /users)
  it('should create a new user successfully', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test User');
    expect(response.body.email).toBe('testuser@example.com');
  });

  it('should reject ticket creation without X-User-Id', async () => {
    const response = await request(app)
      .post('/tickets')
      .send({
        title: 'Test Ticket',
        description: 'This is a test ticket.'
      });

    expect(response.status).toBe(401);
  });

  // Test 404 responses for non-existent users and tickets
  it('should return 404 for a non-existent user', async () => {
    const response = await request(app).get('/users/999999');

    expect(response.status).toBe(404);
  });

  it('should return 404 for a non-existent ticket', async () => {
    const response = await request(app).get('/tickets/999999');
      
    expect(response.status).toBe(404);
  });

  // Test ticket creation (POST /tickets)
  it('should create a ticket successfully with authentication', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'Ticket Creator',
        email: 'creator@example.com',
      });
    
    expect(userResponse.status).toBe(201);
      
    const userId = userResponse.body.id;

    const response = await request(app)
      .post('/tickets')
      .set('X-User-Id', String(userId))
      .send({
        title: 'Test Ticket',
        description: 'This is a test ticket.'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Ticket');
    expect(response.body.description).toBe('This is a test ticket.');
  });

  // Test pagination and filtering on GET /tickets
  it('should support pagination on GET /tickets', async () => {
    const respond = await request(app)
      .get('/tickets')
      .query({ limit: 2, offset: 0 });

    expect(respond.status).toBe(200);
    expect(Array.isArray(respond.body)).toBe(true);
    expect(respond.body.length).toBeLessThanOrEqual(2);
  });
});
