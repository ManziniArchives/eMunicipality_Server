const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

exports.register = async (req, res) => {
  const { first_name, last_name, email, phone, password, role = 'citizen' } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO users(first_name,last_name,email,phone,password_hash,role) VALUES(?,?,?,?,?,?)',
    [first_name, last_name, email, phone, hash, role]
  );
  res.json({ id: result.insertId });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query('SELECT * FROM users WHERE email=?', [email]);
  if (!rows.length || !await bcrypt.compare(password, rows[0].password_hash))
    return res.status(401).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: rows[0].id, role: rows[0].role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: rows[0] });
};

exports.me = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const [rows] = await db.query('SELECT id,first_name,last_name,email,role FROM users WHERE id=?', [decoded.id]);
  res.json(rows[0]);
};