const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { 
    type: String,
    required: true },
  user: { 
    type: Number,
    ref: 'User',
    required: true }, // Store MySQL user ID here
  post: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', required: true },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
