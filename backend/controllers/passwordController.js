const PasswordAnalysis = require('../models/PasswordAnalysis');

const COMMON_PASSWORDS = [
  '123456', 'password', '123456789', '12345678', '12345', '1234567',
  'password1', 'qwerty', 'abc123', 'letmein', 'monkey', 'dragon',
  'iloveyou', 'admin', 'welcome', 'login', 'master', 'hello'
];

function analyzePassword(password) {
  const hasUppercase         = /[A-Z]/.test(password);
  const hasLowercase         = /[a-z]/.test(password);
  const hasNumbers           = /[0-9]/.test(password);
  const hasSpecialCharacters = /[^A-Za-z0-9]/.test(password);
  const hasRepeatedChars     = /(.)\1{2,}/.test(password);
  const hasSimplePattern     = /^(abc|qwerty|123|111|000)/i.test(password);
  const isCommon             = COMMON_PASSWORDS.includes(password.toLowerCase());

  const suggestions = [];
  if (password.length < 8)      suggestions.push('Use at least 8 characters');
  if (password.length < 12)     suggestions.push('Use 12+ characters for stronger security');
  if (!hasUppercase)            suggestions.push('Add uppercase letters (A-Z)');
  if (!hasLowercase)            suggestions.push('Add lowercase letters (a-z)');
  if (!hasNumbers)              suggestions.push('Add numbers (0-9)');
  if (!hasSpecialCharacters)    suggestions.push('Add special characters (!@#$%^&*)');
  if (hasRepeatedChars)         suggestions.push('Avoid repeated characters (e.g. aaa, 111)');
  if (hasSimplePattern)         suggestions.push('Avoid simple patterns (abc, 123, qwerty)');
  if (isCommon)                 suggestions.push('This is a commonly used password — change it immediately');

  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (hasUppercase)          score++;
  if (hasLowercase)          score++;
  if (hasNumbers)            score++;
  if (hasSpecialCharacters)  score++;
  if (hasRepeatedChars)      score--;
  if (hasSimplePattern)      score--;
  if (isCommon)              score -= 2;

  let strengthLevel;
  if (score <= 2)      strengthLevel = 'Weak';
  else if (score <= 4) strengthLevel = 'Medium';
  else                 strengthLevel = 'Strong';

  return {
    passwordLength: password.length,
    strengthLevel,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSpecialCharacters,
    suggestions
  };
}

exports.analyzePassword = async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password is required' });

  const result = analyzePassword(password);
  const record = await PasswordAnalysis.create(result);
  res.status(201).json(record);
};

exports.getHistory = async (req, res) => {
  const history = await PasswordAnalysis.find().sort({ createdAt: -1 }).limit(50);
  res.json(history);
};

exports.deleteHistory = async (req, res) => {
  const deleted = await PasswordAnalysis.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Record not found' });
  res.json({ message: 'Deleted successfully' });
};
