const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  // will fill logic later
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  // will fill logic later
});

module.exports = router;