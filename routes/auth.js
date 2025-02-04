const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { signUpValidation,signInValidation,forgetPasswordValidation } = require('../Validation/Authvalidator');

router.post('/signup',signUpValidation,authController.signUp);
router.post('/signin',signInValidation,authController.logIn);
router.post('/forgotpassword',forgetPasswordValidation,authController.forgotPassword);
router.post('/resetpassword',authController.resetPassword);

module.exports = router;

