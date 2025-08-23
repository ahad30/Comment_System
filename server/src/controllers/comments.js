const { validationResult } = require('express-validator');
const Comment = require('../models/comment');

// controllers/comments.js - getComments function
exports.getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'newest';
    
    const skip = (page - 1) * limit;
    
    let sortOptions = {};
    switch(sortBy) {
      case 'most-liked':
        sortOptions = { likes: -1, createdAt: -1 };
        break;
      case 'most-disliked':
        sortOptions = { dislikes: -1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }
    
    const comments = await Comment.find({ parentComment: null })
      .populate('author', 'username')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username'
        }
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const totalComments = await Comment.countDocuments({ parentComment: null });
    
    res.json({
      comments,
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
      totalComments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// controllers/comments.js - createComment function
exports.createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, parentCommentId } = req.body;
    
    const comment = new Comment({
      content,
      author: req.user._id,
      parentComment: parentCommentId || null
    });
    
    const savedComment = await comment.save();
    
    // If it's a reply, add it to the parent comment's replies array
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(
        parentCommentId,
        { $push: { replies: savedComment._id } }
      );
    }
    
    // Properly populate the response
    const populatedComment = await Comment.findById(savedComment._id)
      .populate('author', 'username')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username'
        }
      });
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    comment.content = content;
    const updatedComment = await comment.save();
    
    const populatedComment = await Comment.findById(updatedComment._id)
      .populate('author', 'username');
    
    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // If it's a parent comment, delete all replies first
    if (comment.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    }
    
    // If it's a reply, remove it from parent's replies array
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(
        comment.parentComment,
        { $pull: { replies: comment._id } }
      );
    }
    
    await Comment.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user already liked
    if (comment.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Comment already liked' });
    }
    
    // Remove from dislikes if exists
    if (comment.dislikes.includes(req.user._id)) {
      comment.dislikes = comment.dislikes.filter(
        id => id.toString() !== req.user._id.toString()
      );
    }
    
    comment.likes.push(req.user._id);
    await comment.save();
    
    res.json({ message: 'Comment liked' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.dislikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user already disliked
    if (comment.dislikes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Comment already disliked' });
    }
    
    // Remove from likes if exists
    if (comment.likes.includes(req.user._id)) {
      comment.likes = comment.likes.filter(
        id => id.toString() !== req.user._id.toString()
      );
    }
    
    comment.dislikes.push(req.user._id);
    await comment.save();
    
    res.json({ message: 'Comment disliked' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

