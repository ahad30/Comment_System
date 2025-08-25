import React, { useState } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Pagination from '../Pagination';
import SortOptions from '../SortOptions';
import { useComments } from '../../context/CommentContext';
import Loader from '../Loader';

const CommentList = () => {
  const { comments, loading, error, pagination, changePage } = useComments();
  const [replyingTo, setReplyingTo] = useState(null);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Comments</h1>
        <SortOptions />
        <CommentForm 
          replyingTo={replyingTo} 
          setReplyingTo={setReplyingTo} 
        />
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <CommentItem 
              key={comment._id} 
              comment={comment}
            />
          ))
        )}
      </div>

      {/* {pagination.totalPages > 1 && ( */}
        <Pagination 
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={changePage}
        />
      {/* )} */}
    </div>
  );
};

export default CommentList;