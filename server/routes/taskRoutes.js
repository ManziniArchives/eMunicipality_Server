const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/', taskController.assign);
router.get('/worker/:workerId', taskController.workerTasks);
router.patch('/:id/status', taskController.updateStatus);

module.exports = router;