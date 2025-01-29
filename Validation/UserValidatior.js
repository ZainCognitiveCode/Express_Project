const {check} = require('express-validator');

const validateUser = [
    check('firstName').notEmpty().withMessage('First Name is required'),
    check('lastName').notEmpty().withMessage('Last Name is required'),
    check('username').isString().withMessage('User Name must be a string').notEmpty().withMessage('User Name is required'),
    check('email').isEmail().withMessage('Invalid email format').notEmpty().withMessage('Email is required'),
    check('password').isString().withMessage('Password must be a string').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];



module.exports = {
    validateUser
}