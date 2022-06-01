const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  first_name: {
    type: String,
    trim: true,
    required: [true, "Please add a student's first_name"],
  },
  last_name: {
    type: String,
    required: [true, "Please add a student's last_name"],
  },
  classroom: {
    type: String,
    required: [true, 'Please add  classroom'],
  },

  school: {
    type: mongoose.Schema.ObjectId,
    ref: 'School',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Student', StudentSchema);
