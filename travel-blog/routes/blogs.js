const express = require('express');
const Blog = require('../models/Blog');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

/**
 * Apply `authenticateToken` middleware globally to protect all routes.
 * This ensures all routes require a valid JWT and attach the username to req.user.
 */
router.use(authenticateToken);

/**
 * @route   GET /api/blogs
 * @desc    Fetch all blogs
 * @access  Protected
 */
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 }); // Sort by newest first
    res.status(200).json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

/**
 * @route   GET /api/blogs/:id
 * @desc    Fetch a single blog by ID
 * @access  Protected
 */
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).json({ error: 'Failed to fetch the blog' });
  }
});

/**
 * @route   POST /api/blogs
 * @desc    Create a new blog
 * @access  Protected
 */
router.post('/', authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
  
    // Validate request body
    if (!title || !content || !tags || !tags.length) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    const author = req.user.username;
  
    try {
      const newBlog = new Blog({ title, content, tags, author });
      await newBlog.save();
      res.status(201).json(newBlog);
    } catch (err) {
      console.error('Error creating blog:', err);
      res.status(500).json({ error: 'Failed to create blog' });
    }
  });
  

/**
 * @route   POST /api/blogs/:id/comments
 * @desc    Add a comment to a blog
 * @access  Protected
 */
router.post('/:id/comments', async (req, res) => {
  const { text } = req.body;
  const username = req.user.username; // Use the authenticated user's username

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Add the comment
    blog.comments.push({ username, text });
    await blog.save();

    res.status(200).json(blog);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

/**
 * @route   DELETE /api/blogs/:id
 * @desc    Delete a blog by ID
 * @access  Protected
 */
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Ensure the user deleting the blog is the author
    if (blog.author !== req.user.username) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await blog.remove();
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

/**
 * @route   DELETE /api/blogs/:id/comments/:commentId
 * @desc    Delete a comment from a blog
 * @access  Protected
 */
router.delete('/:id/comments/:commentId', async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Ensure the user deleting the comment is the author of the comment
    if (comment.username !== req.user.username) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Remove the comment
    comment.remove();
    await blog.save();

    res.status(200).json(blog);
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
