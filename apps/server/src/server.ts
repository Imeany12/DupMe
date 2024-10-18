import { IMsgDataTypes } from '@repo/shared-types/src/types';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import path from 'path';
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});
const rooms: { [key: number]: string[][] } = {}; // to keep track of players in each room

function handleFirstPlayer(
  rooms: { [key: number]: string[][] },
  roomId: number
) {
  const randomPlayer = Math.floor(Math.random() * rooms[roomId].length);
  return rooms[roomId][randomPlayer];
}

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

  socket.on(
    'join_lobby',
    ({ username, roomId }: { username: string; roomId: number }) => {
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }
      rooms[roomId].push([username, socket.id]);
      console.log(rooms[roomId]);
      socket.join(roomId.toString());
      io.to(roomId.toString()).emit('update_players', rooms[roomId]);
      console.log(`user with id-${socket.id} joined room-${roomId}`);

      const connectedUsersCount = Object.values(rooms).reduce(
        (total, roomArray) => total + roomArray.length,
        0
      );
      io.emit('connectedUsersCount', connectedUsersCount);
    }
  );

  socket.on(
    'leave_lobby',
    ({ username, roomId }: { username: string; roomId: number }) => {
      rooms[roomId] = rooms[roomId].filter((player) => player[0] !== username);
      socket.to(roomId.toString()).emit('update_players', rooms[roomId]);
      socket.leave(roomId.toString());
    }
  );

  socket.on('start_game', (roomId: number) => {
    const firstPlayer = handleFirstPlayer(rooms, roomId);
    socket
      .to(roomId.toString())
      .emit('start_game', handleFirstPlayer(rooms, roomId));
    console.log('received start, starting player: ' + firstPlayer[0]);
  });

  socket.on('end_game', (roomId: number) => {
    socket.to(roomId.toString()).emit('end_game');
  });

  socket.on('send_msg', (data: IMsgDataTypes) => {
    // This will send a message to a specific room ID
    io.to(data.roomId.toString()).emit('receive_msg', data);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected:', socket.id);

    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((player) => player[1] !== socket.id);
      socket.to(roomId.toString()).emit('update_players', rooms[roomId]);
      socket.leave(roomId.toString());
    }

    const connectedUsersCount = Object.values(rooms).reduce(
      (total, roomArray) => total + roomArray.length,
      0
    );
    io.emit('connectedUsersCount', connectedUsersCount);
  });
});

server.listen(PORT, () => {
  console.log(`[🎉DupMe] server listening on port ${PORT}`);
});
