const pool = require('../../config/config');

module.exports = {
  // Generic query helper
  query: (sql, params) => pool.execute(sql, params),

  // Utility helpers
  now: () => new Date().toISOString().slice(0, 19).replace('T', ' ')
};