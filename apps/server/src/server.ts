import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { CORS_ORIGIN, PORT } from './env';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
  },
});

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'DupMe server is up!' });
});

app.get('/login', (req: Request, res: Response) => {
  res.json({ message: 'pedo time and saygex' });
});

app.listen(PORT, () => {
  console.log(`[🎉DupMe] app listening on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
});

server.listen(PORT, () => {
  console.log(`[🎉DupMe] server listening on port ${PORT}`);
});
