import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Home.scss';
import { images } from '../assets/images';

const defaultImages = {
  travel: images.travel,
  food: images.food,
  culture: images.culture,
  default: images.default
};

const HomeScreen = () => {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);

  const getImageForBlog = (blog) => {
    if (blog.title.toLowerCase().includes('food')) return defaultImages.food;
    if (blog.title.toLowerCase().includes('culture')) return defaultImages.culture;
    if (blog.title.toLowerCase().includes('travel')) return defaultImages.travel;
    return defaultImages.default[Math.floor(Math.random() * defaultImages.default.length)];
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs`, config);
        setBlogs(data);
        setFeaturedBlogs(data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching blogs:', err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-section__content">
          <h1>Explore the World</h1>
          <p>Discover amazing destinations and share your travel experiences</p>
          <Link to="/create" className="btn btn-lg btn-primary">
            Share Your Story
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="featured-section">
        <div className="container">
          <h2>Featured Adventures</h2>
          <div className="row">
            {featuredBlogs.map((blog) => (
              <div className="col-md-4 mb-4" key={blog._id}>
                <div className="blog-card">
                  <img
                    src={getImageForBlog(blog)}
                    className="blog-card__image card-img-top"
                    alt={blog.title}
                  />
                  <div className="blog-card__content">
                    <h5 className="blog-card__title">{blog.title}</h5>
                    <p className="blog-card__meta">
                      By {blog.author} | {new Date(blog.date).toLocaleDateString()}
                    </p>
                    <p className="card-text">{blog.content.substring(0, 100)}...</p>
                    <Link to={`/blogs/${blog._id}`} className="btn btn-outline-primary">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="latest-posts py-5">
        <div className="container">
          <h2 className="text-center mb-4">Latest Stories</h2>
          <div className="row blog-grid">
            {blogs.map((blog) => (
              <div className="col-md-4 mb-4" key={blog._id}>
                <div className="blog-card">
                  <img
                    src={getImageForBlog(blog)}
                    className="blog-card__image card-img-top"
                    alt={blog.title}
                  />
                  <div className="blog-card__content">
                    <h5 className="blog-card__title">{blog.title}</h5>
                    <p className="blog-card__meta">
                      By {blog.author} | {new Date(blog.date).toLocaleDateString()}
                    </p>
                    <p className="card-text">{blog.content.substring(0, 100)}...</p>
                    <Link to={`/blogs/${blog._id}`} className="btn btn-outline-primary">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;