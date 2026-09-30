# Bug Report

## Bug: Task Priority Changed When Completing a Task

### Description

When completing a task using the `PATCH /tasks/:id/complete` endpoint,
the task priority was incorrectly changed to `medium`.

### Steps to Reproduce

1. Create a task with `priority: "high"`.
2. Call `PATCH /tasks/:id/complete`.
3. Check the completed task response.

### Expected Behavior

The task should retain its original priority after completion.

Example:

```json
{
  "priority": "high",
  "status": "done"
}