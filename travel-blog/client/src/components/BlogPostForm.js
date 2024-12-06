import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BlogPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim()) newErrors.content = 'Content is required';
    if (!tags.trim()) newErrors.tags = 'At least one tag is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Do not submit if validation fails

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const payload = {
        title,
        content,
        tags: tags.split(',').map((tag) => tag.trim()), // Convert tags to an array
      };
      await axios.post('/api/blogs', payload, config);
      alert('Blog created successfully!');
      navigate('/'); // Redirect to the home page
    } catch (err) {
      console.error('Error creating blog:', err.response?.data || err);
      alert('Failed to create blog. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Create a New Blog Post</h1>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>

        {/* Content */}
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            id="content"
            rows="5"
            className={`form-control ${errors.content ? 'is-invalid' : ''}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          {errors.content && <div className="invalid-feedback">{errors.content}</div>}
        </div>

        {/* Tags */}
        <div className="mb-3">
          <label htmlFor="tags" className="form-label">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            className={`form-control ${errors.tags ? 'is-invalid' : ''}`}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          {errors.tags && <div className="invalid-feedback">{errors.tags}</div>}
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default BlogPostForm;
