const db = require('../models');

exports.dashboard = async (req, res) => {
  const [[{ complaints }]] = await db.query('SELECT COUNT(*) AS complaints FROM complaints');
  const [[{ users }]]     = await db.query('SELECT COUNT(*) AS users FROM users');
  const [[{ open }]]      = await db.query('SELECT COUNT(*) AS open FROM complaints WHERE status="open"');
  const [[{ inProgress }]]= await db.query('SELECT COUNT(*) AS inProgress FROM complaints WHERE status="in_progress"');

  res.json({ complaints, users, open, inProgress });
};

exports.userCounts = async (req, res) => {
  const [rows] = await db.query(
    `SELECT role, COUNT(*) AS count FROM users GROUP BY role`
  );
  res.json(rows);
};