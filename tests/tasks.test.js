const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

describe('Task API', () => {
  beforeEach(() => {
    taskService._reset();
  });

  test('GET /tasks should return empty array initially', async () => {
    const response = await request(app)
      .get('/tasks');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /tasks should create a task', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Learn Supertest',
        description: 'Write API tests',
        priority: 'high',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Learn Supertest');
    expect(response.body.description).toBe('Write API tests');
    expect(response.body.priority).toBe('high');
    expect(response.body.status).toBe('todo');
  });

  test('POST /tasks should reject missing title', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        description: 'No title',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('POST /tasks should reject invalid status', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Invalid task',
        status: 'invalid',
      });

    expect(response.statusCode).toBe(400);
  });

  test('GET /tasks should return created tasks', async () => {
    await request(app)
      .post('/tasks')
      .send({ title: 'Task 1' });

    await request(app)
      .post('/tasks')
      .send({ title: 'Task 2' });

    const response = await request(app)
      .get('/tasks');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test('GET /tasks?status=done should filter tasks', async () => {
    await request(app)
      .post('/tasks')
      .send({
        title: 'Todo task',
        status: 'todo',
      });

    await request(app)
      .post('/tasks')
      .send({
        title: 'Done task',
        status: 'done',
      });

    const response = await request(app)
      .get('/tasks?status=done');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe('Done task');
  });

  test('PUT /tasks/:id should update a task', async () => {
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Old title',
      });

    const id = createResponse.body.id;

    const response = await request(app)
      .put(`/tasks/${id}`)
      .send({
        title: 'Updated title',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe('Updated title');
  });

  test('PUT /tasks/:id should return 404 for unknown task', async () => {
    const response = await request(app)
      .put('/tasks/invalid-id')
      .send({
        title: 'Updated',
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Task not found');
  });

  test('DELETE /tasks/:id should delete a task', async () => {
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Delete me',
      });

    const id = createResponse.body.id;

    const response = await request(app)
      .delete(`/tasks/${id}`);

    expect(response.statusCode).toBe(204);
  });

  test('PATCH /tasks/:id/complete should complete a task', async () => {
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Complete me',
        priority: 'high',
      });

    const id = createResponse.body.id;

    const response = await request(app)
      .patch(`/tasks/${id}/complete`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('done');
    expect(response.body.priority).toBe('high');
    expect(response.body.completedAt).not.toBeNull();
  });

  test('GET /tasks/stats should return task statistics', async () => {
    await request(app)
      .post('/tasks')
      .send({
        title: 'Todo',
        status: 'todo',
      });

    await request(app)
      .post('/tasks')
      .send({
        title: 'Done',
        status: 'done',
      });

    const response = await request(app)
      .get('/tasks/stats');

    expect(response.statusCode).toBe(200);
    expect(response.body.todo).toBe(1);
    expect(response.body.done).toBe(1);
  });

  test('GET /tasks?page=1&limit=2 should return first 2 tasks', async () => {
    await request(app)
      .post('/tasks')
      .send({ title: 'Task 1' });

    await request(app)
      .post('/tasks')
      .send({ title: 'Task 2' });

    await request(app)
      .post('/tasks')
      .send({ title: 'Task 3' });

    const response = await request(app)
      .get('/tasks?page=1&limit=2');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe('Task 1');
    expect(response.body[1].title).toBe('Task 2');
  });
  test('PATCH /tasks/:id/assign should assign a task', async () => {
  const createResponse = await request(app)
    .post('/tasks')
    .send({
      title: 'Assign task',
    });

  const taskId = createResponse.body.id;

  const response = await request(app)
    .patch(`/tasks/${taskId}/assign`)
    .send({
      assignee: 'Aarti',
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.assignee).toBe('Aarti');
});

test('PATCH /tasks/:id/assign should return 400 for empty assignee', async () => {
  const createResponse = await request(app)
    .post('/tasks')
    .send({
      title: 'Empty assignee',
    });

  const taskId = createResponse.body.id;

  const response = await request(app)
    .patch(`/tasks/${taskId}/assign`)
    .send({
      assignee: '',
    });

  expect(response.statusCode).toBe(400);
});

test('PATCH /tasks/:id/assign should return 400 if task is already assigned', async () => {
  const createResponse = await request(app)
    .post('/tasks')
    .send({
      title: 'Already assigned',
    });

  const taskId = createResponse.body.id;

  await request(app)
    .patch(`/tasks/${taskId}/assign`)
    .send({
      assignee: 'Rahul',
    });

  const response = await request(app)
    .patch(`/tasks/${taskId}/assign`)
    .send({
      assignee: 'Aarti',
    });

  expect(response.statusCode).toBe(400);
});

test('PATCH /tasks/:id/assign should return 404 for unknown task', async () => {
  const response = await request(app)
    .patch('/tasks/invalid-id/assign')
    .send({
      assignee: 'Aarti',
    });

  expect(response.statusCode).toBe(404);
});
});