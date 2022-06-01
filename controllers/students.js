const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Student = require('../models/Student');
const School = require('../models/School');

// @desc      Get students
// @route     GET /api/v1/students
// @route     GET /api/v1/schools/:schoolId/students
// @access    Public
exports.getStudents = asyncHandler(async (req, res, next) => {
  if (req.params.schoolId) {
    const students = await Student.find({ school: req.params.schoolId });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single student
// @route     GET /api/v1/students/:id
// @access    Public
exports.getStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id).populate({
    path: 'school',
    select: 'name city',
  });

  if (!student) {
    return next(
      new ErrorResponse(`No student with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});

// @desc      Add student
// @route     POST /api/v1/schools/:schoolId/students
// @access    Private
exports.addStudent = asyncHandler(async (req, res, next) => {
  req.body.school = req.params.schoolId;
  req.body.user = req.user.id;

  const school = await School.findById(req.params.schoolId);

  if (!school) {
    return next(
      new ErrorResponse(`No school with the id of ${req.params.schoolId}`),
      404
    );
  }

  // Make sure user is school owner
  if (school.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a student to school ${school._id}`,
        401
      )
    );
  }

  const student = await Student.create(req.body);

  res.status(200).json({
    success: true,
    data: student,
  });
});

// @desc      Update student
// @route     PUT /api/v1/students/:id
// @access    Private
exports.updateStudent = asyncHandler(async (req, res, next) => {
  let student = await Student.findById(req.params.id);

  if (!student) {
    return next(
      new ErrorResponse(`No student with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is student owner
  if (student.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update student ${student._id}`,
        401
      )
    );
  }

  student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: student,
  });
});

// @desc      Delete student
// @route     DELETE /api/v1/students/:id
// @access    Private
exports.deleteStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(
      new ErrorResponse(`No student with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is student owner
  if (student.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete student ${student._id}`,
        401
      )
    );
  }

  await student.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
