const Document = require('../models/Document');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get all documents
// @route   GET /api/documents
// @access  Public
exports.getDocuments = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Public
exports.getDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id).populate('user', 'name');

  if (!document) {
    return next(
      new ErrorResponse(`Document not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: document
  });
});

// @desc    Create new document
// @route   POST /api/documents
// @access  Private/Admin
exports.createDocument = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  // Upload file to Cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: 'auto',
    folder: 'county_assembly/documents'
  });

  // Get file extension
  const fileType = req.file.originalname.split('.').pop().toLowerCase();

  const document = await Document.create({
    title: req.body.title,
    description: req.body.description,
    fileUrl: result.secure_url,
    fileType,
    fileSize: formatBytes(req.file.size),
    category: req.body.category,
    isPublic: req.body.isPublic || true,
    user: req.user.id
  });

  // Delete file from server
  fs.unlinkSync(req.file.path);

  res.status(201).json({
    success: true,
    data: document
  });
});

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private/Admin
exports.updateDocument = asyncHandler(async (req, res, next) => {
  let document = await Document.findById(req.params.id);

  if (!document) {
    return next(
      new ErrorResponse(`Document not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is document owner or admin
  if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this document`,
        401
      )
    );
  }

  document = await Document.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: document
  });
});

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private/Admin
exports.deleteDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    return next(
      new ErrorResponse(`Document not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is document owner or admin
  if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this document`,
        401
      )
    );
  }

  // Delete file from Cloudinary
  const publicId = document.fileUrl.split('/').pop().split('.')[0];
  await cloudinary.uploader.destroy(`county_assembly/documents/${publicId}`);

  await document.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Download document
// @route   GET /api/documents/:id/download
// @access  Public
exports.downloadDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    return next(
      new ErrorResponse(`Document not found with id of ${req.params.id}`, 404)
    );
  }

  res.redirect(document.fileUrl);
});

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}