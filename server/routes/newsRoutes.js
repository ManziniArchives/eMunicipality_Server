const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.post('/', newsController.create);
router.get('/', newsController.list);

module.exports = router;