import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get('/api/blogs', config);
        setBlogs(data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Travel Blog</h1>
      <div className="row">
        {blogs.map((blog) => (
          <div className="col-md-4 mb-3" key={blog._id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text">{blog.content.substring(0, 100)}...</p>
                <p className="text-muted">
                  <small>Created by: {blog.author}</small>
                </p>
                <Link to={`/blogs/${blog._id}`} className="btn btn-primary">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
