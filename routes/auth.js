var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');

router.post('/signUp',authController.signUp);
router.post('/signIn',authController.logIn);
router.post('/forgotPassword',authController.forgotPassword);
router.post('/resetPassword',authController.resetPassword);

module.exports = router;

