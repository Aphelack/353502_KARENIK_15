const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

// Yandex OAuth configuration
const YANDEX_CLIENT_ID = process.env.Yandex_Client_ID;
const YANDEX_CLIENT_SECRET = process.env.Yandex_Client_Secret;
const YANDEX_REDIRECT_URI = process.env.Redirect_URI || 'http://localhost:3000/auth/yandex/callback';

// Register with email/password
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, timezone } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      email,
      password: hashedPassword,
      name,
      timezone: timezone || 'UTC',
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        timezone: user.timezone,
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login with email/password
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        timezone: user.timezone,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Yandex OAuth - Get authorization URL
router.get('/yandex/url', (req, res) => {
  const authUrl = `https://oauth.yandex.com/authorize?response_type=code&client_id=${YANDEX_CLIENT_ID}&redirect_uri=${encodeURIComponent(YANDEX_REDIRECT_URI)}`;
  res.json({ authUrl });
});

// Yandex OAuth - Handle callback
router.post('/yandex/callback', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth.yandex.com/token', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: YANDEX_CLIENT_ID,
        client_secret: YANDEX_CLIENT_SECRET,
        redirect_uri: YANDEX_REDIRECT_URI,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get user info from Yandex
    const userInfoResponse = await axios.get('https://login.yandex.ru/info', {
      headers: { Authorization: `OAuth ${accessToken}` }
    });

    const yandexUser = userInfoResponse.data;

    // Find or create user
    let user = await User.findOne({ yandexId: yandexUser.id });

    if (!user) {
      // Check if email already exists
      user = await User.findOne({ email: yandexUser.default_email });
      
      if (user) {
        // Link Yandex account to existing user
        user.yandexId = yandexUser.id;
        await user.save();
      } else {
        // Create new user
        user = new User({
          yandexId: yandexUser.id,
          email: yandexUser.default_email,
          name: yandexUser.display_name || yandexUser.real_name || 'User',
          timezone: 'UTC',
        });
        await user.save();
      }
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        timezone: user.timezone,
      }
    });
  } catch (error) {
    console.error('Yandex OAuth error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'OAuth authentication failed', 
      error: error.response?.data || error.message 
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      timezone: user.timezone,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
