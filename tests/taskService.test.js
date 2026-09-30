const taskService = require('../src/services/taskService');

describe('Task Service', () => {
  beforeEach(() => {
    taskService._reset();
  });

  test('should create a task with default values', () => {
    const task = taskService.create({
      title: 'Learn Jest',
    });

    expect(task).toHaveProperty('id');
    expect(task.title).toBe('Learn Jest');
    expect(task.status).toBe('todo');
    expect(task.priority).toBe('medium');
    expect(task.description).toBe('');
    expect(task.dueDate).toBe(null);
    expect(task.completedAt).toBe(null);
    expect(task).toHaveProperty('createdAt');
  });

  test('should get all tasks', () => {
    taskService.create({ title: 'Task 1' });
    taskService.create({ title: 'Task 2' });

    const tasks = taskService.getAll();

    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe('Task 1');
    expect(tasks[1].title).toBe('Task 2');
  });

  test('should find a task by id', () => {
    const task = taskService.create({
      title: 'Find me',
    });

    const found = taskService.findById(task.id);

    expect(found).toEqual(task);
  });

  test('should return undefined for unknown id', () => {
    const task = taskService.findById('invalid-id');

    expect(task).toBeUndefined();
  });

  test('should filter tasks by status', () => {
    taskService.create({
      title: 'Todo task',
      status: 'todo',
    });

    taskService.create({
      title: 'Done task',
      status: 'done',
    });

    const tasks = taskService.getByStatus('done');

    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Done task');
  });

  test('should update a task', () => {
    const task = taskService.create({
      title: 'Old title',
    });

    const updated = taskService.update(task.id, {
      title: 'New title',
      priority: 'high',
    });

    expect(updated.title).toBe('New title');
    expect(updated.priority).toBe('high');
    expect(updated.id).toBe(task.id);
  });

  test('should return null when updating unknown task', () => {
    const result = taskService.update('invalid-id', {
      title: 'New title',
    });

    expect(result).toBeNull();
  });

  test('should delete a task', () => {
    const task = taskService.create({
      title: 'Delete me',
    });

    const result = taskService.remove(task.id);

    expect(result).toBe(true);
    expect(taskService.findById(task.id)).toBeUndefined();
  });

  test('should return false when deleting unknown task', () => {
    const result = taskService.remove('invalid-id');

    expect(result).toBe(false);
  });

  test('should complete a task', () => {
    const task = taskService.create({
      title: 'Complete me',
      priority: 'high',
    });

    const completed = taskService.completeTask(task.id);

    expect(completed.status).toBe('done');
    expect(completed.priority).toBe('high');
    expect(completed.completedAt).not.toBeNull();
  });

  test('should return null when completing unknown task', () => {
    const result = taskService.completeTask('invalid-id');

    expect(result).toBeNull();
  });

  test('should return correct statistics', () => {
    taskService.create({
      title: 'Todo',
      status: 'todo',
    });

    taskService.create({
      title: 'Progress',
      status: 'in_progress',
    });

    taskService.create({
      title: 'Done',
      status: 'done',
    });

    const stats = taskService.getStats();

    expect(stats.todo).toBe(1);
    expect(stats.in_progress).toBe(1);
    expect(stats.done).toBe(1);
    expect(stats.overdue).toBe(0);
  });
  test('completing a task should preserve its priority', () => {
  const task = taskService.create({
    title: 'Important task',
    description: 'Test priority',
    status: 'todo',
    priority: 'high',
  });

  const completedTask = taskService.completeTask(task.id);

  expect(completedTask.status).toBe('done');
  expect(completedTask.priority).toBe('high');
  expect(completedTask.completedAt).not.toBeNull();
});
test('should assign a task to an assignee', () => {
  const task = taskService.create({
    title: 'Assign me',
  });

  const updated = taskService.assignTask(task.id, 'Aarti');

  expect(updated.assignee).toBe('Aarti');
  expect(updated.id).toBe(task.id);
});

test('should return null when assigning an unknown task', () => {
  const result = taskService.assignTask('invalid-id', 'Aarti');

  expect(result).toBeNull();
});

test('should not assign a task that is already assigned', () => {
  const task = taskService.create({
    title: 'Already assigned',
  });

  taskService.assignTask(task.id, 'Rahul');

  const result = taskService.assignTask(task.id, 'Aarti');

  expect(result).toBe(false);
});

test('should not allow an empty assignee', () => {
  const task = taskService.create({
    title: 'Empty assignee',
  });

  const result = taskService.assignTask(task.id, '');

  expect(result).toBe(false);
});
});