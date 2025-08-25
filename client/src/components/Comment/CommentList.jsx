import React, { useState } from 'react';
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

  // Handle page change for PrimeReact Paginator
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

      {pagination.totalPages > 1 && (
        <div className="mt-6">
  <Paginator
            first={first}
            rows={pagination.limit}
            totalRecords={pagination.totalComments}
            onPageChange={onPageChange}
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          />
            <Paginator
  first={(currentPage - 1) * 10}
  rows={10}
  totalRecords={characterCount}
  onPageChange={onPageChange}
  template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
  className="bg-gray-800 text-white"
  disabled={loading}
  pt={{
    root: {
      className: "bg-gray-800 border border-gray-700 rounded-lg p-2"
    },
    firstPageButton: {
      className: `text-gray-300 px-3 py-2 rounded transition-colors ${loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:text-yellow-400 hover:bg-gray-700'}`
    },
    prevPageButton: {
      className: `text-gray-300 px-3 py-2 rounded transition-colors ${loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:text-yellow-400 hover:bg-gray-700'}`
    },
    nextPageButton: {
      className: `text-gray-300 px-3 py-2 rounded transition-colors ${loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:text-yellow-400 hover:bg-gray-700'}`
    },
    lastPageButton: {
      className: `text-gray-300 px-3 py-2 rounded transition-colors ${loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:text-yellow-400 hover:bg-gray-700'}`
    },
    pageButton: {
      className: `text-gray-300 px-3 py-2 mx-1 rounded transition-colors ${loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:text-yellow-400 hover:bg-gray-700'}`
    },
    pages: { className: "flex space-x-1" }
  }}
  pagelinkclassname="text-gray-300 hover:text-yellow-400 hover:bg-gray-700 px-3 py-2 mx-1 rounded transition-colors"
  currentPageReportTemplate=""
/>

        </div>
      )}
    </div>
  );
};

export default CommentList;