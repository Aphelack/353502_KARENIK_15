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

// Track processed authorization codes to prevent duplicates
const processedCodes = new Set();
const CODE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// Clean up old codes periodically
setInterval(() => {
  processedCodes.clear();
}, CODE_EXPIRY_MS);

// Retry helper function for API calls
async function retryAxiosRequest(requestFn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      const isTimeout = error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED';
      const isLastAttempt = attempt === maxRetries;
      
      if (!isTimeout || isLastAttempt) {
        throw error;
      }
      
      // Exponential backoff: wait longer between each retry
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Request failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

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
      return res.status(400).json({ 
        success: false,
        message: 'Authorization code is required' 
      });
    }

    // Check if this code has already been processed
    if (processedCodes.has(code)) {
      console.log('Yandex OAuth: Duplicate code detected, ignoring...');
      return res.status(400).json({ 
        success: false,
        message: 'Authorization code has already been used' 
      });
    }

    // Mark code as processed immediately
    processedCodes.add(code);

    // Log first 10 chars of code for debugging (not the full code for security)
    console.log('Yandex OAuth: Exchanging code for token... (code starts with:', code.substring(0, 10) + '...)');
    console.log('Yandex OAuth config:', {
      clientId: YANDEX_CLIENT_ID ? `${YANDEX_CLIENT_ID.substring(0, 8)}...` : 'MISSING',
      clientSecret: YANDEX_CLIENT_SECRET ? '***set***' : 'MISSING',
      redirectUri: YANDEX_REDIRECT_URI
    });

    // Exchange code for access token with retry logic
    let tokenResponse;
    try {
      const requestData = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: YANDEX_CLIENT_ID,
        client_secret: YANDEX_CLIENT_SECRET,
        redirect_uri: YANDEX_REDIRECT_URI, // Must match the authorization request
      });

      console.log('Making request to Yandex token endpoint...');

      tokenResponse = await retryAxiosRequest(
        () => axios.post('https://oauth.yandex.com/token', 
          requestData,
          {
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            timeout: 20000
          }
        ),
        3, // max 3 retries
        1000 // start with 1 second delay
      );

      console.log('Token exchange successful!');
    } catch (tokenError) {
      const errorDetails = {
        status: tokenError.response?.status,
        statusText: tokenError.response?.statusText,
        data: tokenError.response?.data,
        message: tokenError.message,
        code: tokenError.code,
        isAxiosError: tokenError.isAxiosError
      };
      console.error('Token exchange error details:', JSON.stringify(errorDetails, null, 2));
      
      // Remove from processed codes if it failed so it can be retried
      processedCodes.delete(code);
      
      return res.status(500).json({ 
        success: false,
        message: 'Failed to exchange authorization code', 
        error: tokenError.response?.data?.error_description || tokenError.message,
        details: errorDetails
      });
    }

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(500).json({ 
        success: false,
        message: 'No access token received from Yandex' 
      });
    }

    console.log('Yandex OAuth: Token received, fetching user info...');

    // Get user info from Yandex with retry logic
    let userInfoResponse;
    try {
      userInfoResponse = await retryAxiosRequest(
        () => axios.get('https://login.yandex.ru/info?format=json', {
          headers: { Authorization: `OAuth ${accessToken}` },
          timeout: 20000
        }),
        3, // max 3 retries
        1000 // start with 1 second delay
      );
      console.log('User info fetched successfully');
    } catch (userInfoError) {
      const userInfoErrorDetails = {
        status: userInfoError.response?.status,
        statusText: userInfoError.response?.statusText,
        data: userInfoError.response?.data,
        message: userInfoError.message,
        code: userInfoError.code,
        isAxiosError: userInfoError.isAxiosError
      };
      console.error('User info fetch error details:', JSON.stringify(userInfoErrorDetails, null, 2));
      
      // Remove from processed codes so it can be retried
      processedCodes.delete(code);
      
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch user information from Yandex', 
        error: userInfoError.response?.data?.error || userInfoError.message,
        details: userInfoErrorDetails
      });
    }

    const yandexUser = userInfoResponse.data;
    console.log('Yandex user data received:', {
      id: yandexUser.id,
      email: yandexUser.default_email,
      name: yandexUser.display_name
    });

    // Build user name safely
    let userName = 'User';
    if (yandexUser.display_name) {
      userName = yandexUser.display_name;
    } else if (yandexUser.real_name) {
      userName = yandexUser.real_name;
    } else if (yandexUser.first_name || yandexUser.last_name) {
      userName = [yandexUser.first_name, yandexUser.last_name].filter(Boolean).join(' ');
    }

    // Extract email safely
    const userEmail = yandexUser.default_email || 
                      (yandexUser.emails && yandexUser.emails[0]) || 
                      null;

    if (!userEmail) {
      return res.status(400).json({ 
        success: false,
        message: 'No email address provided by Yandex. Please ensure your Yandex account has a verified email.' 
      });
    }

    // Check if user already exists (LOGIN flow)
    let existingUser = await User.findOne({ 
      $or: [{ yandexId: yandexUser.id }, { email: userEmail }]
    });

    if (existingUser) {
      // User exists - login directly
      if (!existingUser.yandexId) {
        // Link Yandex account to existing email user
        existingUser.yandexId = yandexUser.id;
        await existingUser.save();
      }

      const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        success: true,
        isLogin: true,
        token,
        user: {
          id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          timezone: existingUser.timezone,
          avatar: existingUser.avatar,
        }
      });
    }

    // New user - Auto-register
    const timezone = req.body.timezone || 'UTC';
    
    const newUser = new User({
      yandexId: yandexUser.id,
      email: userEmail,
      name: userName,
      timezone: timezone,
      birthDate: yandexUser.birthday || null,
      gender: yandexUser.sex || null,
      avatar: yandexUser.default_avatar_id ? 
        `https://avatars.yandex.net/get-yapic/${yandexUser.default_avatar_id}/islands-200` : null,
      phone: yandexUser.default_phone?.number || null,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      isLogin: true,
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        timezone: newUser.timezone,
        avatar: newUser.avatar,
      }
    });
  } catch (error) {
    console.error('Yandex OAuth unexpected error:', error);
    res.status(500).json({ 
      success: false,
      message: 'OAuth authentication failed', 
      error: error.message || 'Unknown error'
    });
  }
});

// Yandex OAuth - Confirm registration with reviewed data
router.post('/yandex/confirm', async (req, res) => {
  try {
    const { userData, timezone } = req.body;

    if (!userData || !userData.yandexId) {
      return res.status(400).json({ message: 'User data is required' });
    }

    // Check if user already exists
    let user = await User.findOne({ yandexId: userData.yandexId });

    if (!user) {
      // Check if email already exists
      user = await User.findOne({ email: userData.email });
      
      if (user) {
        // Link Yandex account to existing user
        user.yandexId = userData.yandexId;
        if (userData.avatar) user.avatar = userData.avatar;
        if (userData.birthDate) user.birthDate = userData.birthDate;
        if (userData.gender) user.gender = userData.gender;
        if (userData.phone) user.phone = userData.phone;
        await user.save();
      } else {
        // Create new user with all data
        user = new User({
          yandexId: userData.yandexId,
          email: userData.email,
          name: userData.name,
          timezone: timezone || 'UTC',
          birthDate: userData.birthDate,
          gender: userData.gender,
          avatar: userData.avatar,
          phone: userData.phone,
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
        avatar: user.avatar,
        birthDate: user.birthDate,
        gender: user.gender,
      }
    });
  } catch (error) {
    console.error('Yandex confirm error:', error);
    res.status(500).json({ 
      message: 'Failed to create user', 
      error: error.message 
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
