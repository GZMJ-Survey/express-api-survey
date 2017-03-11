'use strict';

const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  response: {
    type: Boolean,
    required: false,
  }
});

const questionSchema = new mongoose.Schema({
  problem: {
    type: String,
    required: false,
  },
  answers: [answerSchema]
});

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questions: [questionSchema]
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

// surveySchema.virtual('length').get(function length() {
//   return this.text.length;
// });

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;
