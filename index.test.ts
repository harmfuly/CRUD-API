import request from 'supertest';
import server from './index';

let createdUserId: string;

describe('User API', () => {
  it('GET /api/users should return a list of users', async () => {
    const res = await request(server).get('/api/users');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.statusText).toBe('Ok');
  });

  it('POST /api/users should create a new user', async () => {
    const newUser = {
      username: 'Test User',
      age: 25,
      hobbies: ['coding', 'reading']
    };

    const res = await request(server)
      .post('/api/users')
      .send(newUser)
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.username).toBe(newUser.username);

    createdUserId = res.body.data.id;
  });

  it('GET /api/users/:id should return the created user', async () => {
    const res = await request(server).get(`/api/users/${createdUserId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('id', createdUserId);
    expect(res.body.data.username).toBe('Test User');
  });

  it('PUT /api/users/:id should update the user', async () => {
    const updatedUser = {
      username: 'Updated User',
      age: 26,
      hobbies: ['testing']
    };

    const res = await request(server)
      .put(`/api/users/${createdUserId}`)
      .send(updatedUser)
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('id', createdUserId);
    expect(res.body.data.username).toBe(updatedUser.username);
    expect(res.body.data.age).toBe(updatedUser.age);
  });

  it('should delete the user', async () => {
    const res = await request(server).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(204);
  });

  it('should return a 404 error when trying to get a deleted user', async () => {
    const res = await request(server).get(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'User not found with the provided userId.'); // Меняем сообщение на правильное
  });
});
