const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const postValidator = require('../Validation/PostValidator')

// API's
router.get('/:postId?',postController.getPostData);
router.post('/',postValidator,postController.createPost);
router.put('/:postId',postController.updatePost);
router.delete('/:postId',postController.deletePost);


module.exports = router;