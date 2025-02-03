const express = require('express');
const router = express.Router();
const Post = require('../Schemas/Post')
const Comment = require('../Schemas/Comment');
const User = require('../models/user'); 

// 1. Create a new post
router.post('/', async (req, res) => {
    try {
      const { title, content } = req.body;
      const newPost = new Post({ title, content });
      await newPost.save();
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // 2. Get all posts
  router.get('/', async (req, res) => {
    try {
      // Fetch posts with only title and content, and populate comments
      const posts = await Post.find().select('title content').populate('comments');
  
      // For each post, populate comments with user names
      const populatedPosts = await Promise.all(
        posts.map(async (post) => {
          const populatedComments = await Promise.all(
            post.comments.map(async (comment) => {
              // Fetch user data from MySQL
              const user = await User.findByPk(comment.user); // Fetch user by ID from MySQL
  
              // Return only comment content and username
              return {
                content: comment.content,
                user: user ? user.username : 'Unknown', // Show username or fallback
              };
            })
          );
  
          // Return only required fields for posts
          return {
            title: post.title,
            content: post.content,
            comments: populatedComments,
          };
        })
      );
  
      res.status(200).json(populatedPosts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.get('/:postId', async (req, res) => {
    try {
      // Fetch the post by ID with only title and content, and populate comments
      const post = await Post.findById(req.params.postId)
        .select('title content')
        .populate('comments');
        
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Populate comments with user names
      const populatedComments = await Promise.all(
        post.comments.map(async (comment) => {
          // Fetch user data from MySQL
          const user = await User.findByPk(comment.user); 
  
          // Return only comment content and username
          return {
            content: comment.content,
            user: user ? user.username : 'Unknown',
          };
        })
      );
  
      // Return only required fields for the post
      res.status(200).json({
        title: post.title,
        content: post.content,
        comments: populatedComments,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  
  // 4. Update a post by ID
  router.put('/:postId', async (req, res) => {
    try {
      const updatedPost = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true });
      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // 5. Delete a post by ID
  router.delete('/:postId', async (req, res) => {
    try {
      const deletedPost = await Post.findByIdAndDelete(req.params.postId);
      if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      // Optionally delete associated comments here
      await Comment.deleteMany({ post: req.params.postId });
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  module.exports = router;