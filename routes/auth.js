var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');
const { signUpValidation,signInValidation,forgetPasswordValidation } = require('../Validation/Authvalidators');

router.post('/signUp',signUpValidation,authController.signUp);
router.post('/signIn',signInValidation,authController.logIn);
router.post('/forgotPassword',forgetPasswordValidation,authController.forgotPassword);
router.post('/resetPassword',authController.resetPassword);

module.exports = router;

