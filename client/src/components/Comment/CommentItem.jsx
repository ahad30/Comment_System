// components/CommentItem.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComments } from '../../context/CommentContext';
import { toast } from 'sonner';
import DeleteModal from '../Modal/DeleteModal';

const CommentItem = ({ comment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment?.content || '');
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const { updateComment, deleteComment, likeComment, dislikeComment } = useComments();
  const isAuthor = user && user?._id === comment?.author?._id;
  const hasLiked = user && comment?.likes?.includes(user?._id);
  const hasDisliked = user && comment?.dislikes?.includes(user?._id);


  useEffect(() => {
    if (isEditing) {
      setEditContent(comment?.content || '');
    }
  }, [isEditing, comment?.content]);

  if (!comment) {
    return <div className="bg-gray-100 p-4 rounded shadow mb-4">Comment not available</div>;
  }

  const handleEdit = async () => {
    if (editContent.trim() === '') {
      toast.error("Comment content cannot be empty");
      return;
    }
    const result = await updateComment(comment._id, editContent);
    if (result.success) {
      setIsEditing(false);
      toast.success("Comment Edited Successfully");
    } else {
      console.error(result.error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleDelete = async (commentId) => {
    const result = await deleteComment(commentId);
    if (!result.success) {
      console.error(result.error);
    }
    toast.success("Comment Deleted Successfully");
    setShowModal(false);  
  };

  const handleLike = async () => {
    if (hasLiked){
      toast.error("You have already liked this comment");
      return;
    }
    const result = await likeComment(comment._id);
    if (result.success) {
      toast.success("Comment Liked Successfully");
    }
    else{
      console.error(result.error);
    }
  };

  const handleDislike = async () => {
    if (hasDisliked){
      toast.error("You have already disliked this comment");
      return;
    }
    const result = await dislikeComment(comment._id);
    if (result.success) {
      toast.success("Comment Disliked Successfully");
    }
    else{
      console.error(result.error);
    }
  };

  return (
    <div className={`bg-white border border-gray-400 p-4 rounded shadow-md mb-4`}>
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
              onClick={handleCancel}
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

        {isAuthor && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => setShowModal(!showModal)}
              className="text-gray-500 hover:text-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {showModal && (
        <DeleteModal 
          showModal={showModal} 
          setShowModal={setShowModal} 
          comment={comment} 
          handleDelete={handleDelete} 
        />
      )}
    </div>
  );
};

export default CommentItem;