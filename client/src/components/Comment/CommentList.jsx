import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import SortOptions from '../SortOptions';
import { useComments } from '../../context/CommentContext';
import Loader from '../Loader';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const CommentList = () => {
  const { comments, loading, error, pagination, changePage } = useComments();
  const [first, setFirst] = useState(0);


  useEffect(() => {
    const expectedFirst = (pagination.page - 1) * pagination.limit;
    if (first !== expectedFirst) {
      setFirst(expectedFirst);
    }
  }, [pagination.page, pagination.limit, pagination.totalComments]);

  const onPageChange = (event) => {
    setFirst(event.first);
    const newPage = Math.floor(event.first / pagination.limit) + 1;
    changePage(newPage);
  };

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
        <CommentForm />
      </div>

      <div className="space-y-8 max-h-[100vh] overflow-y-scroll py-4">
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
      
    
        <div className="mt-6">
          <Paginator
            first={first}
            rows={pagination.limit}
            totalRecords={pagination.totalComments}
            onPageChange={onPageChange}
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            pt={{
              pageButton: ({ active }) => ({
                className: active
                  ? "bg-blue-500 text-white rounded-md px-3 py-1"
                  : "text-gray-700 hover:bg-gray-200 rounded-md px-3 py-1"
              })
            }}
          />
        </div>

    </div>
  );
};

export default CommentList;