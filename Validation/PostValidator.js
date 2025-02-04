const {check} = require('express-validator');


const validatePost = [
    check('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    check('content')
        .trim()
        .notEmpty().withMessage('Content is required')
        .isLength({ min: 10 }).withMessage('Content must be at least 10 characters long')
];

module.exports = validatePost;