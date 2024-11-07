import { IMsgDataTypes, ISong } from '@repo/shared-types/src/types';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import path from 'path';
import { Server } from 'socket.io';

import { MONGO_URL, PORT } from './env';
import mainRoutes from './routes/main';
import scoreRoutes from './routes/score';
import userRoutes from './routes/user';
import { shuffleArray } from './utils/shuffle';

const app = express();
app.use(express.json());
app.get('/', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(cors());

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
const playerToScore: {
  [key: number]: {
    // roomId
    [key: string]: number; // username and socketId to score
  };
} = {}; // to keep track of player scores
let playerCount = 0;

function handlePlayerTurn(
  rooms: { [key: number]: string[][] },
  roomId: number
) {
  // This will randomize the player turns by shuffling the array
  const randomPlayerTurn = shuffleArray(rooms[roomId]);
  return randomPlayerTurn;
}

mongoose
  .connect(MONGO_URL, { dbName: 'dbconnect' })
  .then(() => console.log('Database connection established'))

  .catch((error) => console.error('Error connecting to database:', error));

io.on('connection', (socket) => {
  if (socket.id === undefined || socket.handshake.headers === undefined) {
    console.log('undefiened');
    return;
  }
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
    ({
      username,
      image,
      roomId,
    }: {
      username: string;
      image: string;
      roomId: number;
    }) => {
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }
      rooms[roomId].push([username, image, socket.id]);
      console.log(rooms[roomId]);
      socket.join(roomId.toString());
      io.to(roomId.toString()).emit('update_players', rooms[roomId]);
      console.log(`user with id-${socket.id} joined room-${roomId}`);

      const connectedUsersCount = Object.values(rooms).reduce(
        (total, roomArray) => total + roomArray.length,
        0
      );
      console.log('connectedUsersCount', connectedUsersCount);
      io.emit('connectedUsersCount', connectedUsersCount);
    }
  );

  socket.on(
    'leave_lobby',
    ({ username, roomId }: { username: string; roomId: number }) => {
      console.log('leave_lobby');
      rooms[roomId] = rooms[roomId].filter((player) => player[0] !== username);
      socket.to(roomId.toString()).emit('update_players', rooms[roomId]);
      socket.leave(roomId.toString());
    }
  );

  socket.on('start_game', (roomId: number) => {
    const playerTurns = handlePlayerTurn(rooms, roomId);
    socket.to(roomId.toString()).emit('start_game', playerTurns);
    socket.emit('start_game', playerTurns);
    console.log('received start, starting player: ' + playerTurns);
  });

  socket.on('end_game', (roomId: number, score: number, username: string) => {
    if (!playerToScore[roomId]) {
      playerToScore[roomId] = {};
    }
    if (!playerToScore[roomId][username]) {
      playerToScore[roomId][username] = 0;
    }
    playerToScore[roomId][username] = score;
    console.log('end_game', rooms[roomId].length, playerToScore[roomId]);
    console.log('playerCount:', playerCount);
    if (Object.keys(playerToScore[roomId]).length === playerCount) {
      const scoreArray = Object.values(playerToScore[roomId]);
      const maxScore = Math.max(...scoreArray);
      const winners = Object.keys(playerToScore[roomId]).filter(
        (key) => playerToScore[roomId][key] === maxScore
      );

      if (winners.length > 1) {
        // Handle draw scenario
        io.to(roomId.toString()).emit('result', { result: 'draw', winners });
      } else {
        // Handle single winner scenario
        io.to(roomId.toString()).emit('result', {
          result: 'win',
          winner: [winners[0]],
        });
      }
      console.log('winner:', winners);
    }
    socket.to(roomId.toString()).emit('end_game');
  });

  socket.on('send_msg', (data: IMsgDataTypes) => {
    // This will send a message to a specific room ID
    socket.to(data.roomId.toString()).emit('receive_msg', data);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected:', socket.id);

    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((player) => player[2] !== socket.id);
      socket.to(roomId.toString()).emit('update_players', rooms[roomId]);
      socket.leave(roomId.toString());
    }
    for (const roomId in playerToScore) {
      delete playerToScore[roomId][socket.id];
    }

    const connectedUsersCount = Object.values(rooms).reduce(
      (total, roomArray) => total + roomArray.length,
      0
    );
    io.emit('connectedUsersCount', connectedUsersCount);
  });

  socket.on('send_song', (data: ISong) => {
    // This will send a song to a specific room ID
    console.log(data);
    socket.to(data.roomId.toString()).emit('receive_song', data);
  });

  socket.on('getNote', (roomId: number, note: string) => {
    console.log('getNote', note);
    socket.to(roomId.toString()).emit('playNote', note);
  });

  socket.on('play_song', (roomId: number) => {
    socket.to(roomId.toString()).emit('play_song');
  });

  socket.on('countReady', (readyPlayers: number, roomId) => {
    console.log('countReady', readyPlayers);
    io.to(roomId).emit('setReady', readyPlayers);
  });
});

server.listen(PORT, () => {
  console.log(`[🎉DupMe] server listening on port ${PORT}`);
});
