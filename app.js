const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const authRoutes = require('./server/routes/authRoutes');
const complaintRoutes = require('./server/routes/complaintRoutes');
const taskRoutes = require('./server/routes/taskRoutes');
const newsRoutes = require('./server/routes/newsRoutes');
const adminRoutes = require('./server/routes/adminRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// REST endpoints
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/admin', adminRoutes);

// Real-time notifications
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on('join', (userId) => socket.join(`user_${userId}`));
});

// Make io globally available
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`eMunicipality API on :${PORT}`));