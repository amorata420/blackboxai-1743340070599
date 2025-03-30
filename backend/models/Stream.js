const mongoose = require('mongoose');

const StreamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a stream title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  streamKey: {
    type: String,
    unique: true,
    required: true
  },
  isLive: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  thumbnail: {
    type: String,
    default: 'default-thumbnail.jpg'
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'assembly-session',
      'committee-meeting',
      'public-hearing',
      'special-event'
    ]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate stream key before saving
StreamSchema.pre('save', async function(next) {
  if (!this.streamKey) {
    this.streamKey = generateStreamKey();
  }
  next();
});

// Generate random stream key
function generateStreamKey() {
  return [...Array(32)]
    .map(() => Math.random().toString(36)[2])
    .join('');
}

module.exports = mongoose.model('Stream', StreamSchema);