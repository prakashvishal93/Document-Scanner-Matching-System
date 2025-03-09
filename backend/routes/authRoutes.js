const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { getUserProfile } = require('../controllers/profileController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/user/profile', authenticateJWT, getUserProfile);

module.exports = router;
