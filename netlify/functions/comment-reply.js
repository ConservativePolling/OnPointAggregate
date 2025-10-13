// This is handled by article-comments.js via path checking
// Keeping this file for backward compatibility but redirecting to main handler
const handler = require('./article-comments').handler;
exports.handler = handler;
