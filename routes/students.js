const express = require('express');
const {
  getStudents,
  getStudent,
  addStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/students');

const Student = require('../models/Student');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Student, {
      path: 'school',
      select: 'name city',
    }),
    getStudents
  )
  .post(protect, authorize('publisher', 'admin'), addStudent);

router
  .route('/:id')
  .get(getStudent)
  .put(protect, authorize('publisher', 'admin'), updateStudent)
  .delete(protect, authorize('publisher', 'admin'), deleteStudent);

module.exports = router;
