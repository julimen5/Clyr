import request from 'supertest';
import { Server } from 'http';
import app from '../../src/server';

let server: Server;

beforeAll((done) => {
  server = app.listen(3003, () => {
    console.log('Test server running on port 3000');
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

describe('POST /policies', () => {
  describe('Failing tests', () => {
    it('should return bad request', async () => {
      return request(server)
        .post('/policies')
        .send({ name: 'test', description: 'test' })
        .set('x-auth', 'ecc3184d-41be-4228-8e56-13ea6d6a5482')
        .expect(400)
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body).toStrictEqual({
            error: true,
            httpCode: 400,
            message: 'Invalid user data',
            errors: [
              {
                code: 'invalid_type',
                expected: 'string',
                received: 'undefined',
                path: ['teamId'],
                message: 'Required',
              },
              {
                code: 'invalid_type',
                expected: 'array',
                received: 'undefined',
                path: ['hierarchyRequirements'],
                message: 'Required',
              },
              {
                code: 'invalid_type',
                expected: 'array',
                received: 'undefined',
                path: ['approvers'],
                message: 'Required',
              },
            ],
          });
        });
    });
  });

  describe('Passing tests', () => {
    it('should create a policy', () => {
      return request(server)
        .post('/policies')
        .send({
          teamId: 'ecc3184d-41be-4228-8e56-13ea6d6a5483',
          isForAll: false,
          conditions: [
            {
              field: 'amount',
              operator: 'GREATER_THAN',
              value: '1000',
            },
            {
              field: 'merchant',
              operator: 'EQUALS',
              value: 'Amazon',
            },
          ],
          hierarchyRequirements: [
            {
              hierarchy: 0,
              minApprovers: 2,
            },
            {
              hierarchy: 1,
              minApprovers: 1,
            },
          ],
          approvers: [
            {
              userId: 'ecc3184d-41be-4228-8e56-13ea6d6a5483',
              hierarchy: 1,
            },
            {
              role: 'USER',
              hierarchy: 0,
            },
          ],
        })
        .set('x-auth', 'ecc3184d-41be-4228-8e56-13ea6d6a5482')
        .expect(201)
        .then((res) => {
          expect(res.statusCode).toBe(201);
        });
    });
  });
});
