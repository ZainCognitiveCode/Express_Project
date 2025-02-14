const express = require('express');
const router = express.Router();
const Post = require('../Schemas/Post')
const Comment = require('../Schemas/Comment');
const User = require('../models/user'); 

const commentController = require('../controllers/commentController');
const commentValidator = require('../Validation/commentValidator');

router.get('/:postId',commentController.getComment).post('/:postId',commentValidator,commentController.createComment)
.put('/:commentId',commentController.updateComment).delete('/:commentId',commentController.deleteComment);

module.exports = router;
