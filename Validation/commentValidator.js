const {check} = require('express-validator');

const validateComment = [
    check('content').notEmpty().withMessage('Content is required'),
    check('userId').isInt().withMessage('Valid userId is required'),
  ];


  module.exports = validateComment;