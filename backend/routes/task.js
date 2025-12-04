// Task CRUD with auth + filters + search


const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);


// GET /api/tasks
router.get('/', async (req, res) => {
    try {
      const { status, search } = req.query;
  
      const query = { user: req.user.id };
  
      if (status) {
        query.status = status; // 'todo' | 'in_progress' | 'done'
      }
  
      if (search) {
        const regex = new RegExp(search, 'i');
        query.$or = [{ title: regex }, { description: regex }];
      }
  
      const tasks = await Task.find(query).sort({ createdAt: -1 });
  
      res.json(tasks);
    } catch (err) {
      console.error('Get tasks error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

// POST /api/tasks
router.post('/', async (req, res) => {
    try {
      const { title, description, dueDate, priority, status } = req.body;
  
      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }
  
      const task = await Task.create({
        user: req.user.id,
        title,
        description,
        dueDate,
        priority,
        status,
      });
  
      res.status(201).json(task);
    } catch (err) {
      console.error('Create task error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      let task = await Task.findOne({ _id: id, user: req.user.id });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      const { title, description, dueDate, priority, status } = req.body;
  
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (priority !== undefined) task.priority = priority;
      if (status !== undefined) task.status = status;
  
      await task.save();
  
      res.json(task);
    } catch (err) {
      console.error('Update task error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.json({ message: 'Task deleted' });
    } catch (err) {
      console.error('Delete task error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;