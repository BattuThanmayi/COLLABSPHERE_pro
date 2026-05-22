require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect DB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collabsphere';
connectDB(MONGO_URI).catch(err => { console.error(err); process.exit(1); });

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Serve simple health check
app.get('/status', (req, res) => res.json({ ok: true }));

// Serve static (optional) - when deploying with frontend inside same project
app.use(express.static(path.join(__dirname, '..')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CollabSphere backend running on port ${PORT}`);
});
