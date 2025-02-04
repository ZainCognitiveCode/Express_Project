const Post = require('../Schemas/Post');
const Comment = require('../Schemas/Comment');
const User = require('../models/user'); 

// 1. Create a new comment for a post
const createComment = async(req,res) =>{
    try {
        const { content, userId } = req.body;  // Get userId from request body
    
        // Validate that the user exists in MySQL
        const user = await User.findByPk(userId);  // Assuming User is MySQL model
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        const post = await Post.findById(req.params.postId);
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
    
        // Create a new comment
        const newComment = new Comment({
          content,
          user: user.id,  // Store MySQL user ID
          post: post._id,
        });
    
        await newComment.save();
    
        // Optionally, update the post with the new comment ID
        post.comments.push(newComment._id);
        await post.save();
    
        res.status(201).json(newComment);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

// 2. Get comments for a post with pagination (Sequential User Fetching)
const getComment = async(req,res)=>{
    try {
        const { page = 1 } = req.query;
        const limit = 50;
        const skip = (page - 1) * limit;
    
        // Fetch comments from MongoDB
        const comments = await Comment.find({ post: req.params.postId })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });
    
        // Populate user data from MySQL sequentially
        const populatedComments = [];
        for (const comment of comments) {
          const user = await User.findByPk(comment.user);  // Fetch user from MySQL
          populatedComments.push({
            content: comment.content,
            user: user ? { name: user.username } : null,
          });
        }
    
        res.status(200).json(populatedComments);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

// 3. Update a comment
const updateComment = async(req,res)=>{
    try {
        const { content } = req.body;
        const comment = await Comment.findById(req.params.commentId);
    
        if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
        }
    
        comment.content = content;
        await comment.save();
    
        res.status(200).json({ message: 'Comment updated successfully', comment });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

// 4. Delete a comment

const deleteComment = async(req,res)=>{
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);
        if (!deletedComment) {
          return res.status(404).json({ message: 'Comment not found' });
        }
    
        // Optionally, remove the comment reference from the post
        const post = await Post.findById(deletedComment.post);
        if (post) {
          post.comments = post.comments.filter(comment => comment.toString() !== deletedComment._id.toString());
          await post.save();
        }
    
        res.status(200).json({ message: 'Comment deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

module.exports = {getComment,createComment,updateComment,deleteComment};
