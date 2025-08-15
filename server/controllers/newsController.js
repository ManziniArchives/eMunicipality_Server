const db = require('../models');

// POST /api/news
exports.create = async (req, res) => {
  const { title, body, image_url, priority = 'medium' } = req.body;
  const [result] = await db.query(
    'INSERT INTO news(title,body,image_url,priority,created_by) VALUES (?,?,?,?,?)',
    [title, body, image_url, priority, req.user?.id || 1]  // default admin
  );
  res.json({ id: result.insertId });
};

// GET /api/news
exports.list = async (req, res) => {
  const [rows] = await db.query(
    'SELECT n.*, u.first_name, u.last_name FROM news n JOIN users u ON n.created_by=u.id ORDER BY created_at DESC'
  );
  res.json(rows);
};