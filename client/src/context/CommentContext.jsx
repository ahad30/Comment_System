import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import io from 'socket.io-client';
import api from '../services/api';

const CommentContext = createContext();

export const useComments = () => {
  return useContext(CommentContext);
};

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalComments: 0
  });
  const [sortBy, setSortBy] = useState('newest');
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('comment-added', (comment) => {
      setComments(prev => [comment, ...prev]);
    });

    newSocket.on('comment-modified', (comment) => {
      setComments(prev => prev.map(c => 
        c._id === comment._id ? comment : c
      ));
    });

    newSocket.on('comment-removed', (commentId) => {
      setComments(prev => prev.filter(c => c._id !== commentId));
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (user) {
      fetchComments();
    }
  }, [user, pagination.page, sortBy]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/comments?page=${pagination.page}&limit=${pagination.limit}&sortBy=${sortBy}`);
      setComments(res?.data.comments);
      setPagination(prev => ({
        ...prev,
        totalPages: res?.data.totalPages,
        totalComments: res?.data.totalComments
      }));
    } catch (error) {
      setError('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content, parentCommentId = null) => {
    try {
      const res = await api.post('/comments', { content, parentCommentId });
      if (socket) {
        socket.emit('new-comment', res.data);
      }
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add comment';
      return { success: false, error: message };
    }
  };

  const updateComment = async (id, content) => {
    try {
      const res = await api.put(`/comments/${id}`, { content });
      if (socket) {
        socket.emit('comment-updated', res.data);
      }
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update comment';
      return { success: false, error: message };
    }
  };

  const deleteComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      if (socket) {
        socket.emit('comment-deleted', id);
      }
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete comment';
      return { success: false, error: message };
    }
  };

  const likeComment = async (id) => {
    try {
      await api.post(`/comments/${id}/like`);
      await fetchComments(); // Refresh comments to update likes
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to like comment';
      return { success: false, error: message };
    }
  };

  const dislikeComment = async (id) => {
    try {
      await api.post(`/comments/${id}/dislike`);
      await fetchComments(); // Refresh comments to update dislikes
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to dislike comment';
      return { success: false, error: message };
    }
  };

  const removeReaction = async (id) => {
    try {
      await api.delete(`/comments/${id}/reaction`);
      await fetchComments(); // Refresh comments to update reactions
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove reaction';
      return { success: false, error: message };
    }
  };

  const changePage = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const changeSort = (sort) => {
    setSortBy(sort);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const value = {
    comments,
    loading,
    error,
    pagination,
    sortBy,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment,
    removeReaction,
    changePage,
    changeSort,
    fetchComments
  };

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
};