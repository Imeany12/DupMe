import { io } from 'socket.io-client';

export const socket = io('http://localhost:5001');

socket.on('disconnect', () => {
  window.location.reload();
});
