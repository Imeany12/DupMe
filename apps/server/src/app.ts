import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const port = 5001;
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'DupMe server is up!' });
});

app.get('/login', (req: Request, res: Response) => {
  res.json({ message: 'pedo time and saygex' });
});

app.listen(port, () => {
  console.log(`[🎉DupMe] app listening on port ${port}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log(`[🎉DupMe] server listening on port ${port}`);
});
