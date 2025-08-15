const db = require('../models');
const path = require('path');

exports.create = async (req, res) => {
  const { title, description, category, ward_id, lat, lng } = req.body;
  const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
  const [result] = await db.query(
    'INSERT INTO complaints(user_id,ward_id,title,description,category,location,photo_url) VALUES(?,?,?,?,?,POINT(?,?),?)',
    [req.user.id, ward_id, title, description, category, lat, lng, photo_url]
  );
  res.json({ id: result.insertId });
};

exports.list = async (req, res) => {
  const sql = `SELECT c.*, u.first_name, u.last_name FROM complaints c JOIN users u ON c.user_id=u.id ORDER BY c.created_at DESC`;
  const [rows] = await db.query(sql);
  res.json(rows);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  await db.query('UPDATE complaints SET status=? WHERE id=?', [status, req.params.id]);
  res.json({ msg: 'updated' });
};

exports.heatmap = async (req, res) => {
  const [rows] = await db.query('SELECT id,title,location FROM complaints WHERE status IN ("open","in_progress")');
  res.json(rows);
};


exports.uploadPhoto = async (req, res) => {
  const file = req.file;
  res.json({ url: `/uploads/${file.filename}` });
};

exports.getByUser = async (req, res) => {
  const [rows] = await db.query(
    'SELECT c.*, w.name AS ward_name FROM complaints c JOIN wards w ON c.ward_id=w.id WHERE c.user_id=? ORDER BY c.created_at DESC',
    [req.user.id]
  );
  res.json(rows);
};