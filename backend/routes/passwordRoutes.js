const express = require('express');
const router  = express.Router();
const { analyzePassword, getHistory, deleteHistory } = require('../controllers/passwordController');

router.post('/analyze-password',       analyzePassword);
router.get('/password-history',        getHistory);
router.delete('/password-history/:id', deleteHistory);

module.exports = router;
