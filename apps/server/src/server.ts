import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import { MONGO_URL, PORT } from './env';
import mainRoutes from './routes/main';
import scoreRoutes from './routes/score';
import userRoutes from './routes/user';

const app = express();
app.use(express.json());

app.use('/user', userRoutes);
app.use('/', mainRoutes);
app.use('/score', scoreRoutes);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

mongoose
  .connect(MONGO_URL, { dbName: 'dbconnect' })
  .then(() => console.log('Database connection established'))

  .catch((error) => console.error('Error connecting to database:', error));

io.on('connection', (socket) => {
  console.log(
    'a user connected:',
    socket.id,
    'ip address:',
    socket.handshake.headers['x-forwarded-for'],
    'total connected:',
    io.engine.clientsCount
  );
  io.emit('total connected:', io.engine.clientsCount);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`user with id-${socket.id} joined room-${roomId}`);
  });

  socket.on('send_msg', (data) => {
    // This will send a message to a specific room ID
    socket.to(data.roomId).emit('receive_msg', data);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected:', socket.id);

    io.emit('total connected:', io.engine.clientsCount);
  });
});

server.listen(PORT, () => {
  console.log(`[🎉DupMe] server listening on port ${PORT}`);
});
