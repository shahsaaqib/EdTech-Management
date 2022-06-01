const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const School = require('../models/School');

// @desc      Get all schools
// @route     GET /api/v1/schools
// @access    Public
exports.getSchools = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single school
// @route     GET /api/v1/schools/:id
// @access    Public
exports.getSchool = asyncHandler(async (req, res, next) => {
  const school = await School.findById(req.params.id);

  if (!school) {
    return next(
      new ErrorResponse(`School not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: school });
});

// @desc      Create new school
// @route     POST /api/v1/schools
// @access    Private
exports.createSchool = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;

  // Check for published school
  const publishedSchool = await School.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one school
  if (publishedSchool && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a school`,
        400
      )
    );
  }

  const school = await School.create(req.body);

  res.status(201).json({
    success: true,
    data: school,
  });
});

// @desc      Update school
// @route     PUT /api/v1/schools/:id
// @access    Private
exports.updateSchool = asyncHandler(async (req, res, next) => {
  let school = await School.findById(req.params.id);

  if (!school) {
    return next(
      new ErrorResponse(`School not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is school owner
  if (school.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this school`,
        401
      )
    );
  }

  school = await School.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: school });
});

// @desc      Delete school
// @route     DELETE /api/v1/schools/:id
// @access    Private
exports.deleteSchool = asyncHandler(async (req, res, next) => {
  const school = await School.findById(req.params.id);

  if (!school) {
    return next(
      new ErrorResponse(`School not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is school owner
  if (school.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this school`,
        401
      )
    );
  }

  school.remove();

  res.status(200).json({ success: true, data: {} });
});
