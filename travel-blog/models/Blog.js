const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  comments: [{ username: String, text: String }],
});

module.exports = mongoose.model('Blog', blogSchema);
