const Stream = require('../models/Stream');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all streams
// @route   GET /api/streams
// @access  Public
exports.getStreams = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single stream
// @route   GET /api/streams/:id
// @access  Public
exports.getStream = asyncHandler(async (req, res, next) => {
  const stream = await Stream.findById(req.params.id).populate('user', 'name email');

  if (!stream) {
    return next(
      new ErrorResponse(`Stream not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: stream
  });
});

// @desc    Create new stream
// @route   POST /api/streams
// @access  Private/Admin
exports.createStream = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const stream = await Stream.create(req.body);

  res.status(201).json({
    success: true,
    data: stream
  });
});

// @desc    Update stream
// @route   PUT /api/streams/:id
// @access  Private/Admin
exports.updateStream = asyncHandler(async (req, res, next) => {
  let stream = await Stream.findById(req.params.id);

  if (!stream) {
    return next(
      new ErrorResponse(`Stream not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is stream owner or admin
  if (stream.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this stream`,
        401
      )
    );
  }

  stream = await Stream.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: stream
  });
});

// @desc    Delete stream
// @route   DELETE /api/streams/:id
// @access  Private/Admin
exports.deleteStream = asyncHandler(async (req, res, next) => {
  const stream = await Stream.findById(req.params.id);

  if (!stream) {
    return next(
      new ErrorResponse(`Stream not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is stream owner or admin
  if (stream.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this stream`,
        401
      )
    );
  }

  await stream.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Start stream
// @route   PUT /api/streams/:id/start
// @access  Private/Admin
exports.startStream = asyncHandler(async (req, res, next) => {
  const stream = await Stream.findById(req.params.id);

  if (!stream) {
    return next(
      new ErrorResponse(`Stream not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if stream is already live
  if (stream.isLive) {
    return next(
      new ErrorResponse(`Stream is already live`, 400)
    );
  }

  stream.isLive = true;
  stream.startTime = Date.now();
  await stream.save();

  res.status(200).json({
    success: true,
    data: stream
  });
});

// @desc    End stream
// @route   PUT /api/streams/:id/end
// @access  Private/Admin
exports.endStream = asyncHandler(async (req, res, next) => {
  const stream = await Stream.findById(req.params.id);

  if (!stream) {
    return next(
      new ErrorResponse(`Stream not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if stream is not live
  if (!stream.isLive) {
    return next(
      new ErrorResponse(`Stream is not currently live`, 400)
    );
  }

  stream.isLive = false;
  stream.endTime = Date.now();
  await stream.save();

  res.status(200).json({
    success: true,
    data: stream
  });
});

// @desc    Get live streams
// @route   GET /api/streams/live
// @access  Public
exports.getLiveStreams = asyncHandler(async (req, res, next) => {
  const streams = await Stream.find({ isLive: true }).populate('user', 'name');

  res.status(200).json({
    success: true,
    count: streams.length,
    data: streams
  });
});