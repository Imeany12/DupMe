import { io } from 'socket.io-client';

import { SOCKET_URL } from './env';

export const socket = io(SOCKET_URL);

socket.on('disconnect', () => {
  window.location.reload();
});
