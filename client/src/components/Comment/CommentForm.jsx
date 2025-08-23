// components/CommentForm.js
import React, { useState } from 'react';
import { useComments } from '../../context/CommentContext';

const CommentForm = () => {
  const [content, setContent] = useState('');
  const { addComment } = useComments();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const result = await addComment(content);
    if (result.success) {
      setContent('');
      
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-2">
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={ "Write your comment..."}
          className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
        />
      </div>
      <div className="flex justify-end">
       
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {'Post Comment'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;