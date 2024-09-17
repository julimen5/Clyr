import request from 'supertest';
import { Server } from 'http';
import app from '../src/server';
let server: Server;

beforeAll((done) => {
  server = app.listen(3002, () => {
    console.log('Test server running on port 3000');
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

describe('GET /health', () => {
  it.skip('should return status ok', async () => {
    return request(app)
      .get('/health')
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
      });
  });
});
