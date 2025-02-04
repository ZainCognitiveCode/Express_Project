const Post = require('../Schemas/Post');
const Comment = require('../Schemas/Comment');
const User = require('../models/user');

const getPostData = async (req, res) => {
    try {
        const filter = req.params.postId ? { _id: req.params.postId } : {};

        const posts = await Post.find(filter)
            .select('title content')
            .populate({
                path: 'comments',
                populate: { path: 'user', select: 'username' }
            })
            .lean();

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'Post(s) not found' });
        }

        const formattedPosts = posts.map(post => ({
            title: post.title,
            content: post.content,
            comments: post.comments.map(comment => ({
                content: comment.content,
                user: comment.user ? comment.user.username : 'Unknown'
            }))
        }));

        res.status(200).json(req.params.postId ? formattedPosts[0] : formattedPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createPost = async(req,res) =>{
    try {
        const { title, content } = req.body;
        const newPost = new Post({ title, content });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updatePost = async(req,res) =>{
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true, lean: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deletePost = async(req,res)=>{
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Delete associated comments
        await Comment.deleteMany({ post: req.params.postId });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {getPostData,createPost,updatePost,deletePost};