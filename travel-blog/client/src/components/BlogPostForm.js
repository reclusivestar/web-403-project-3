import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/BlogPostForm.scss'; 

const BlogPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim()) newErrors.content = 'Content is required';
    if (!tags.trim()) newErrors.tags = 'At least one tag is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
        tags: tags.split(',').map((tag) => tag.trim()),
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/blogs`, payload, config);
      alert('Blog created successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error creating blog:', err.response?.data || err);
      alert('Failed to create blog. Please try again.');
    }
  };

  return (
    <div className="blog-post-form">
      {/* Hero Section */}
      <div className="hero-section mb-5">
        <div className="hero-content">
          <h1>Create Your Story</h1>
          <p>Share your travel experiences with the world</p>
        </div>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="form-card">
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-4">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your blog title"
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                {/* Content */}
                <div className="mb-4">
                  <label htmlFor="content" className="form-label">
                    Content
                  </label>
                  <textarea
                    id="content"
                    rows="8"
                    className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your story..."
                  ></textarea>
                  {errors.content && <div className="invalid-feedback">{errors.content}</div>}
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <label htmlFor="tags" className="form-label">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    className={`form-control ${errors.tags ? 'is-invalid' : ''}`}
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="travel, food, culture (comma-separated)"
                  />
                  {errors.tags && <div className="invalid-feedback">{errors.tags}</div>}
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-lg px-5">
                    Publish Story
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostForm;