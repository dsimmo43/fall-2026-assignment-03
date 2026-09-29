import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 2: Time Logs Tests', () => {
  // TODO: Student implementation - Part 2: Time Logging Tests

  // Log hours for a ticket (POST /tickets/:id/time)
  it('should log hours for a ticket', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'Time Log User',
        email: 'time.log.user@example.com'
      });

    expect(userResponse.status).toBe(201);

    const userId = userResponse.body.id;

    const ticketResponse = await request(app)
      .post('/tickets')
      .set('X-User-Id', String(userId))
      .send({
        title: 'Time Log Test Ticket',
        description: 'Testing time logging.'
      });

    expect(ticketResponse.status).toBe(201);

    const ticketId = ticketResponse.body.id;

    const response = await request(app)
      .post(`/tickets/${ticketId}/time`)
      .set('X-User-Id', String(userId))
      .send({
        hours: 2
      });

      expect(response.status).toBe(201);
      expect(response.body.ticket_id).toBe(ticketId);
      expect(response.body.user_id).toBe(userId);
      expect(response.body.hours).toBe(2);
  });
  
  // Fetch total hours for a ticket (GET /tickets/:id/time)
  // Verify aggregation math
  it('should calculate the total hours for a ticket', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'Aggregation Test User',
        email: 'aggregation@example.com'
      });

      expect(userResponse.status).toBe(201);

      const userId = userResponse.body.id;

      const ticketResponse = await request(app)
        .post('/tickets')
        .set('X-User-Id', String(userId))
        .send({
          title: 'Aggregation Test Ticket',
          description: 'Testing total hours.'
        });

      expect(ticketResponse.status).toBe(201);

      const ticketId = ticketResponse.body.id;

      await request(app)
        .post(`/tickets/${ticketId}/time`)
        .set('X-User-Id', String(userId))
        .send({ hours: 2 });

      await request(app)
        .post(`/tickets/${ticketId}/time`)
        .set('X-User-Id', String(userId))
        .send({ hours: 3 });

      await request(app)
        .post(`/tickets/${ticketId}/time`)
        .set('X-User-Id', String(userId))
        .send({ hours: 5 });

      const response = await request(app)
        .get(`/tickets/${ticketId}/time`);

      expect(response.status).toBe(200);
      expect(response.body.ticket_id).toBe(ticketId);
      expect(response.body.total_hours).toBe(10);
  });
})
