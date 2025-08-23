// components/CommentItem.js
import React, { useState } from 'react';
import CommentForm from './CommentForm';
import { useComments } from '../../context/CommentContext';
import { useAuth } from '../../context/AuthContext';

const CommentItem = ({ comment, replyingTo, setReplyingTo, depth = 0 }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment?.content || '');
  const { user } = useAuth();
  const { updateComment, deleteComment, likeComment, dislikeComment, removeReaction } = useComments();
  const isAuthor = user && user?._id === comment?.author?._id;
  const hasLiked = user && comment?.likes?.includes(user?._id);
  const hasDisliked = user && comment?.dislikes?.includes(user?._id);
  const maxDepth = 3;

  // If comment is undefined, return null or a placeholder
  if (!comment) {
    return <div className="bg-gray-100 p-4 rounded shadow mb-4">Comment not available</div>;
  }

  const handleEdit = async () => {
    const result = await updateComment(comment._id, editContent);
    if (result?.success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(comment._id);
    }
  };

  const handleLike = async () => {
    if (hasLiked) {
      await removeReaction(comment._id);
    } else {
      await likeComment(comment._id);
    }
  };

  const handleDislike = async () => {
    if (hasDisliked) {
      await removeReaction(comment._id);
    } else {
      await dislikeComment(comment._id);
    }
  };

  const handleReply = () => {
    setReplyingTo(comment._id);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <div className={`bg-white p-4 rounded shadow mb-4 ${depth > 0 ? 'ml-6' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold">{comment.author?.username || 'Unknown User'}</div>
        <div className="text-sm text-gray-500">
          {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Unknown date'}
        </div>
      </div>

      {isEditing ? (
        <div className="mb-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border rounded"
            rows="3"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="mb-4">{comment.content}</p>
      )}

      <div className="flex items-center space-x-4 text-sm">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${hasLiked ? 'text-blue-600' : 'text-gray-500'}`}
          disabled={!user}
        >
          <span>👍</span>
          <span>{comment.likes?.length || 0}</span>
        </button>

        <button
          onClick={handleDislike}
          className={`flex items-center space-x-1 ${hasDisliked ? 'text-red-600' : 'text-gray-500'}`}
          disabled={!user}
        >
          <span>👎</span>
          <span>{comment.dislikes?.length || 0}</span>
        </button>

        {user && depth < maxDepth && (
          <button
            onClick={handleReply}
            className="text-gray-500 hover:text-blue-600"
            disabled={replyingTo === comment._id}
          >
            Reply
          </button>
        )}

        {isAuthor && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-blue-600"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* Reply form */}
      {replyingTo === comment._id && (
        <div className="mt-4 pl-4 border-l-2 border-gray-200">
          <CommentForm 
            replyingTo={replyingTo} 
            setReplyingTo={setReplyingTo} 
          />
        </div>
      )}

      {/* Nested replies */}
      {comment?.replies && comment?.replies?.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-gray-200">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply._id} 
              comment={reply} 
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;