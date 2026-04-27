const mongoose = require('mongoose');

const passwordAnalysisSchema = new mongoose.Schema({
  passwordLength:       { type: Number, required: true },
  strengthLevel:        { type: String, enum: ['Weak', 'Medium', 'Strong'], required: true },
  hasUppercase:         { type: Boolean, default: false },
  hasLowercase:         { type: Boolean, default: false },
  hasNumbers:           { type: Boolean, default: false },
  hasSpecialCharacters: { type: Boolean, default: false },
  suggestions:          { type: [String], default: [] },
  createdAt:            { type: Date, default: Date.now }
});

module.exports = mongoose.model('PasswordAnalysis', passwordAnalysisSchema);
