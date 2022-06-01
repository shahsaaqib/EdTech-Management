const express = require('express');
const {
  getSchools,
  getSchool,
  createSchool,
  updateSchool,
  deleteSchool,
} = require('../controllers/schools');

const School = require('../models/School');

// Include other resource routers
const studentRouter = require('./students');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:schoolId/students', studentRouter);

router
  .route('/')
  .get(advancedResults(School, 'students'), getSchools)
  .post(protect, authorize('publisher', 'admin'), createSchool);

router
  .route('/:id')
  .get(getSchool)
  .put(protect, authorize('publisher', 'admin'), updateSchool)
  .delete(protect, authorize('publisher', 'admin'), deleteSchool);

module.exports = router;
