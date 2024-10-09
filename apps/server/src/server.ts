import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { PORT } from './env';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'DupMe server is up!' });
});

app.get('/login', (req: Request, res: Response) => {
  res.json({ message: 'pedo time and saygex' });
});

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
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
  });
});

server.listen(PORT, () => {
  console.log(`[🎉DupMe] server listening on port ${PORT}`);
});
