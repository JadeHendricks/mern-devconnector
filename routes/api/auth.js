const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { check, validationResult } = require('express-validator')

// Get api/auth
// Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json('Server Error');
  }
});

// POST api/auth
// Authenticate user and get token
// Public
router.post('/', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()})
  }

  const { name, email, password } = req.body;

  try {
  // See if the user exists
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }]})
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }]})
  }

  // Return Jwt
  const payload = {
    user: { id: user.id }
  }

  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 3600
  }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  })

  } catch (err) {
    console.error(err.message);
    res.stauts(500). send('Server Error');
  }
});


module.exports = router;