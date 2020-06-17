const express = require('express');
const router = express.Router();

// Get api/post
// Public
router.get('/', (req, res) => {
  res.send('Post Route')
});

module.exports = router;