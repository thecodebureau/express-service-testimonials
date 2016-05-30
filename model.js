'use strict';

const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  order: Number,
  date: Date,
  quote: { type: String, required: true },
  // for a url
  source: String,
  author: {
    givenName: { type: String, required: true },
    familyName: { type: String, required: true },
    // The job title of the person (for example, Financial Manager).
    jobTitle: String,
    worksFor: String,
  }
});

TestimonialSchema.plugin(require('mongopot/plugins/base'));

module.exports = mongoose.model('Testimonial', TestimonialSchema);
