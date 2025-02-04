const express = require('express');
const router = express.Router();
const Post = require('../Schemas/Post')
const Comment = require('../Schemas/Comment');
const User = require('../models/user'); 

const commentController = require('../controllers/commentController');
const commentValidator = require('../Validation/commentValidator');

router.get('/:postId',commentController.getComment) ;
router.post('/:postId',commentValidator,commentController.createComment);
router.put('/:commentId',commentController.updateComment);
router.delete('/:commentId',commentController.deleteComment);

module.exports = router;
