# Submission Notes

## Tests Added

### Unit Tests
Added unit tests for:
- Task creation
- Getting all tasks
- Finding tasks by ID
- Status filtering
- Task update
- Task deletion
- Task completion
- Task statistics
- Task assignment
- Invalid task assignment
- Already assigned tasks
- Empty assignee validation

### API / Integration Tests
Added API tests for:
- Creating tasks
- Getting tasks
- Updating tasks
- Deleting tasks
- Completing tasks
- Task statistics
- Assigning tasks
- Invalid task ID
- Empty assignee
- Already assigned task

## Coverage

Final test result:

- Test Suites: 2 passed
- Tests: 33 passed
- Statements: 91.13%
- Branches: 78.02%
- Functions: 93.10%
- Lines: 90.14%

## Bug Found and Fixed

While testing the complete-task functionality, I found that completing a
task incorrectly changed its priority to `medium`.

The issue was caused by the following logic in `completeTask()`:

```js
priority: 'medium'