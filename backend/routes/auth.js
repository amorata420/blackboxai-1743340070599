const express = require('express');
const router = express.Router();
const { 
  registerUser,
  loginUser,
  getMe,
  updateUser,
  changePassword
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/update', protect, updateUser);
router.put('/change-password', protect, changePassword);

module.exports = router;