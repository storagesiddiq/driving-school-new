require('dotenv').config();
const mongoose = require('mongoose')
const app = require('./app')
const http = require('http');
const setupSocketIo = require('./utils/setSocket');
const path = require('path');
const express = require('express');
const User = require('./models/UserModel')
const cron = require('node-cron');

// const buildPath = path.resolve(__dirname, '../frontend/dist');
// app.use(express.static(buildPath));

// // For all other requests, serve the Vite-built index.html
// app.get('*', (req, res) => {
//     res.sendFile(path.join(buildPath, 'index.html'));
// });



mongoose.connect(process.env.MONGO_URL, {
useNewUrlParser: true,
 useUnifiedTopology: true
}).then(() => {
  const server = http.createServer(app);
  setupSocketIo(server);
  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT} and running in ${process.env.NODE_ENV}`);
  });
}).catch(err => {
  console.error('Database connection error:', err);
});


// Define cron job
cron.schedule('* * * * *', async () => {
  const inactiveDuration = 10 * 60 * 1000; // 5 minutes inactivity duration
  const now = Date.now();

  try {
      await User.updateMany(
          { lastActivity: { $lt: now - inactiveDuration } },
          { isActive: false }
      );
      await User.updateMany(
        { lastActivity: { $gt: now - inactiveDuration } },
        { isActive: true }
    );
      console.log('User activity status updated');
  } catch (error) {
      console.error('Error updating user activity status:', error);
  }
});
