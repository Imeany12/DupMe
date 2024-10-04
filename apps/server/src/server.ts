import express, { Request, Response } from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import { CORS_ORIGIN, MONGO_URL, PORT } from './env';
import userRoutes from './routes/user';

const app = express();
app.use(express.json());

app.use('/user', userRoutes);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
  },
});

mongoose
  .connect(MONGO_URL, { dbName: 'dbconnect' })
  .then(() => console.log('Database connection established'))

  .catch((error) => console.error('Error connecting to database:', error));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'DupMe server is up!' });
});

app.get('/login', (req: Request, res: Response) => {
  res.json({ message: 'pedo time and saygex' });
});

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
});

server.listen(PORT, () => {
  console.log(`[🎉DupMe] server listening on port ${PORT}`);
});
