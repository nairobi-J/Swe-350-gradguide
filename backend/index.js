const express = require('express');
const { createServer } = require('http');
const { Server: SocketIoServer } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
app.use(express.json());
// A potential typo: it should likely be process.env.PORT, not process.env.POOL
// We will default to 5000 if the environment variable is not set.
const PORT = process.env.PORT || 5000;

app.use(cors());
const server = createServer(app);
const io = new SocketIoServer(server, {
  cors: {
    origin : "http://localhost:3000",
    methods:["GET", "POST"]
  }
})


// All route files are required at the top
const authRoutes = require('./routes/authRoutes');
const universityRoutes = require('./routes/universityRouter');
const universityProgramsRoutes = require('./routes/universityProgramsRouter');
const postRoutes = require('./routes/postRoutes');
const programRoutes = require('./routes/programRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const eventRoutes = require('./routes/eventRoutes');
const regFormRoutes = require('./routes/regFormRoutes');
const eventFeedbackRoutes = require('./routes/eventFeedbackRoutes');
const eventQueryRoutes = require('./routes/eventQueryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const guidelines = require('./routes/guidelines');
const paymentRoutes = require('./routes/paymentRoutes');



app.use('/auth', authRoutes);
app.use('/uni', universityRoutes);
app.use('/uni/programs', universityProgramsRoutes);
app.use('/post', postRoutes);
app.use('/program', programRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/event', eventRoutes);
app.use('/regform', regFormRoutes);
app.use('/eventFeedback', eventFeedbackRoutes);
app.use('/eventQuery', eventQueryRoutes);
app.use('/review', reviewRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/generate', guidelines);




io.on('connection', (socket) => {
  console.log(`user connected: ${socket.id}`);
  socket.on('join_room', (data) => {
    socket.join(data.chatId);
     console.log(`User ${socket.id} joined room: ${data.chatId}`);
  })

  socket.on('send_message', (data)=>{
    io.to(data.chatId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected : ${socket.id}`);
  })
})


// You had some duplicate app.use() statements that are not necessary.
// For example, app.post('/auth', authRoutes) is redundant if you already have app.use('/auth', authRoutes)
// The app.use() automatically handles all HTTP verbs (GET, POST, PUT, DELETE)

// Handle a basic home route to confirm the server is running
app.get('/', (req, res) => {
  res.status(200).send('Server is running and healthy!');
});

// Start the server and ensure it is always listening
// In a real production setup, you would still want to listen here,
// but you might handle the PORT differently or use a process manager.
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// A good practice is to catch uncaught exceptions to prevent the server from crashing
process.on('uncaughtException', err => {
  console.error('❌ There was an uncaught exception:', err);
  process.exit(1); // mandatory exit after an uncaught exception
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

