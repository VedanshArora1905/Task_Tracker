const express = require('express');
const Task = require('../models/task');

const router = express.Router();

// GET /api/tasks
router.get('/', async (req, res) => {
  // list tasks (will add auth + logic later)
});

// POST /api/tasks
router.post('/', async (req, res) => {
  // create task
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  // update task
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  // delete task
});

module.exports = router;