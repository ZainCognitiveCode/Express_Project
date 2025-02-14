const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { signUpValidation,signInValidation,forgetPasswordValidation } = require('../Validation/Authvalidator');

router.post('/signup',signUpValidation,authController.signUp).post('/signin',signInValidation,authController.logIn)
.post('/forgotpassword',forgetPasswordValidation,authController.forgotPassword).post('/resetpassword',authController.resetPassword);

module.exports = router;

