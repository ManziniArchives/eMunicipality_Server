const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.post('/', upload.single('photo'), complaintController.create);
router.get('/', complaintController.list);
router.patch('/:id/status', complaintController.updateStatus);
router.get('/heatmap', complaintController.heatmap);
router.get('/my', complaintController.getByUser);
router.post('/upload', upload.single('photo'), complaintController.uploadPhoto);

module.exports = router;