const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const postValidator = require('../Validation/PostValidator')

// API's
router.get('/:postId?',postController.getPostData).post('/',postValidator,postController.createPost).put('/:postId',postController.updatePost)
.delete('/:postId',postController.deletePost);


module.exports = router;