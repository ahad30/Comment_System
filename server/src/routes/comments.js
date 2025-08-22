const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
} = require('../controllers/comments');

// Validation rules
const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
];

router.get('/comment',auth, getComments);
router.post('/comment', auth, commentValidation, createComment);
router.put('/comment/:id', auth, commentValidation, updateComment);
router.delete('/comment/:id', auth, deleteComment);
router.post('/comment/:id/like', auth, likeComment);
router.post('/comment/:id/dislike', auth, dislikeComment);
module.exports = router;