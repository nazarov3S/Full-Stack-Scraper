const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  minPrice: {
    type: Number,
    required: false,
  },
  maxPrice: {
    type: Number,
    required: false,
  },
  hood: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('Search', searchSchema);
