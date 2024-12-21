import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BlogDetailScreen = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${id}`, config);
        setBlog(data);
        setComments(data.comments);
      } catch (err) {
        console.error('Error fetching blog:', err);
      }
    };

    fetchBlog();
  }, [id]);

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/blogs/${id}/comments`, { text: comment }, config);
      setComments(data.comments);
      setComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>{blog.title}</h1>
      <p className="text-muted">
        <small>Created by: {blog.author}</small>
      </p>
      <p>{blog.content}</p>
      <h3>Comments</h3>
      <ul>
        {comments.map((c, index) => (
          <li key={index}>
            <strong>{c.username}:</strong> {c.text}
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          className="form-control"
        />
        <button onClick={handleAddComment} className="btn btn-primary mt-2">
          Submit Comment
        </button>
      </div>
    </div>
  );
};

export default BlogDetailScreen;
