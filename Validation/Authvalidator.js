const {check} = require('express-validator');

const signUpValidation = [
    check('firstName').notEmpty().withMessage('First Name is required'),
    check('lastName').notEmpty().withMessage('Last Name is required'),
    check('email').isEmail().withMessage('Invalid email Address'),
    check('userID').notEmpty().withMessage('User ID is required'),
    check('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
]

const signInValidation = [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').notEmpty().withMessage('Password is required'),
];


const forgetPasswordValidation = [
    check('email').isEmail().withMessage('Invalid email address'),
];

module.exports = {
    signUpValidation, 
    signInValidation,
    forgetPasswordValidation,
};