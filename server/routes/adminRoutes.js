const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/dashboard', adminController.dashboard);
router.get('/users/count', adminController.userCounts);

module.exports = router;