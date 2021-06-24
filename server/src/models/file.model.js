const mongoose = require('mongoose')
const checker = require('../helpers/checker')

const fileSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'User ID is required',
    ref: 'User'
  },
  path: {
    type: String,
    default: '/',
    trim: true,
    required: 'Path is required'
  },
  name: {
    type: String,
    default: 'New file',
    trim: true,
    required: 'Name is required'
  },
}, {
  timestamps: true
})

//#region Validation

fileSchema.path('name').validate(v => checker.isFile(v), 'Invalid file')

//#endregion Validation

module.exports = mongoose.model('File', fileSchema)