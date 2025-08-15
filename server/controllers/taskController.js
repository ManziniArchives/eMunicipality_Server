const db = require('../models');

exports.assign = async (req, res) => {
  // TODO: real logic
  res.json({ msg: 'Task assigned stub' });
};

exports.workerTasks = async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM tasks WHERE worker_id=? ORDER BY due_date',
    [req.params.workerId]
  );
  res.json(rows);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  await db.query('UPDATE tasks SET status=? WHERE id=?', [status, req.params.id]);
  res.json({ msg: 'Task status updated' });
};