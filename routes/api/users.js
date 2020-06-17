const express = require('express');
const router = express.Router();

// Get api/users
// Public
router.get('/', (req, res) => {
  res.send('User Route')
});

module.exports = router;