const mongoose = require('mongoose')
const checker = require('../helpers/checker')

const folderSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'User ID is required',
    ref: 'User'
  },
  path: {
    type: String,
    default: '/',
    trim: true,
    required: 'Path ID is required'
  },
  name: {
    type: String,
    default: 'New folder',
    trim: true,
    required: 'Name ID is required'
  },
}, {
  timestamps: true
})

//#region Validation

folderSchema.path('name').validate(v => checker.isFolder(v), 'Invalid folder')

//#endregion Validation

module.exports = mongoose.model('Folder', folderSchema)