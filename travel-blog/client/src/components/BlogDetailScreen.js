import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/BlogDetail.scss';

const BlogDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  // get current user
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');

  const currentUsername = localStorage.getItem('user');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(`/api/blogs/${id}`, config);
        setBlog(data);
        setComments(data.comments);
        setEditedTitle(data.title);
        setEditedContent(data.content);
      } catch (err) {
        console.error('Error fetching blog:', err);
      }
    };

    fetchBlog();
  }, [id]);

  const handleUpdatePost = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `/api/blogs/${id}`,
        {
          title: editedTitle,
          content: editedContent,
        },
        config
      );
      setBlog(data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `/api/blogs/${id}/comments/${commentId}`,
        { text: editedCommentText },
        config
      );
      setComments(data.comments);
      setEditingCommentId(null);
      setEditedCommentText('');
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(`/api/blogs/${id}/comments`, { text: comment }, config);
      setComments(data.comments);
      setComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // add delete comment handle function
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.delete(`/api/blogs/${id}/comments/${commentId}`, config);
      setComments(data.comments);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  //delete post and return to main page
  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`/api/blogs/${id}`, config);
        navigate('/'); 
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="blog-detail">
      <div className="hero-section">
        <h1>{blog.title}</h1>
      </div>

      <div className="blog-content">
        <div className="meta-info">
          <span className="author">By {blog.author}</span>
          <span className="mx-2">•</span>
          <span className="date">
            {new Date(blog.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          {currentUsername === blog.author && (
            <div className="float-end">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline-primary btn-sm me-2"
                  >
                    Edit Post
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="btn btn-outline-danger btn-sm"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="form-control mb-3"
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="form-control mb-3"
              rows="8"
            />
            <div className="text-end">
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary me-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePost}
                className="btn btn-success"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="blog-text">{blog.content}</div>
        )}
      </div>

      <div className="comments-section">
        <h3>Comments ({comments.length})</h3>
        {comments.map((c) => (
          <div key={c._id} className="comment-item">
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <div className="comment-author">{c.username}</div>
                {editingCommentId === c._id ? (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={editedCommentText}
                      onChange={(e) => setEditedCommentText(e.target.value)}
                      className="form-control"
                    />
                    <div className="mt-2">
                      <button
                        onClick={() => handleUpdateComment(c._id)}
                        className="btn btn-success btn-sm me-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditedCommentText('');
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="comment-text">{c.text}</div>
                )}
              </div>
              {currentUsername === c.username && editingCommentId !== c._id && (
                <div className="comment-actions">
                  <button
                    onClick={() => {
                      setEditingCommentId(c._id);
                      setEditedCommentText(c.text);
                    }}
                    className="btn btn-outline-primary btn-sm me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="comment-form">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="form-control"
          />
          <button
            onClick={handleAddComment}
            className="btn btn-primary"
            disabled={!comment.trim()}
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailScreen;