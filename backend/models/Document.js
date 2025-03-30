const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx', 'xlsx', 'pptx', 'txt'],
    required: true
  },
  fileSize: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'minutes',
      'reports',
      'bills',
      'budgets',
      'policies',
      'notices'
    ]
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add pagination plugin
DocumentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Document', DocumentSchema);