import request from 'supertest';
import { Server } from 'http';
import app from '../../src/server';

let server: Server;

beforeAll((done) => {
  server = app.listen(3001, () => {
    console.log('Test server running on port 3000');
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

describe('Failing middleware', () => {
  describe('Failing tests', () => {
    it('should return status ok', async () => {
      return request(server)
        .post('/policies')
        .send({ name: 'test', description: 'test' })
        .expect(401)
        .then((res) => {
          expect(res.statusCode).toBe(401);
          expect(res.body).toEqual({
            error: true,
            httpCode: 401,
            message: ' is unauthorized',
          });
        });
    });
  });
});
