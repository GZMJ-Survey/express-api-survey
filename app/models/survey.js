'use strict';

const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: Boolean,
    required: false,
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret, options) {
      let userId = (options.user && options.user._id) || false;
      ret.editable = userId && userId.equals(doc._owner);
      return ret;
    },
  },
});

surveySchema.virtual('length').get(function length() {
  return this.text.length;
});

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;
