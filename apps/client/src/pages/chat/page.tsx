'use client';

import { IMsgDataTypes } from '@repo/shared-types/src/types';
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import style from './page.module.css';

const ChatPage = ({
  socket,
  username,
  roomId,
}: {
  socket: Socket;
  username: string;
  roomId: number;
}): React.JSX.Element => {
  const [currentMsg, setCurrentMsg] = useState('');
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);
  const [onlinePlayers, setOnlinePlayers] = useState(-999);

  const sendData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg !== '') {
      const msgData: IMsgDataTypes = {
        roomId: roomId,
        user: username,
        msg: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      };
      socket.emit('send_msg', msgData);
      setChat((pre) => [msgData, ...pre]);
      setCurrentMsg('');
    }
  };

  // const sendStart = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   socket.emit('start_game', roomId);
  // };

  useEffect(() => {
    socket.on('receive_msg', (data: IMsgDataTypes) => {
      setChat((pre) => [data, ...pre]);
    });

    socket.on('connectedUsersCount', (usersCount: number) => {
      setOnlinePlayers(usersCount);
    });

    socket.on('start_game', (player: string[]) => {
      // listening to start_game with first player
      console.log('starting player: ' + player);
    });

    return () => {
      // Don't forget to clean up!
      socket.off('receive_msg');
      socket.off('connectedUsersCount');
      socket.off('start_game');
    };
  }, [socket]);

  return (
    <div className='flex w-full flex-col items-center justify-center px-4'>
      <div className='mx-auto flex w-full flex-col gap-4 rounded-lg border-2 border-gray-100 px-8 py-3'>
        <h1 className='w-full text-center text-3xl font-semibold text-white'>
          Chat
        </h1>
        <div className='flex h-32 max-h-44 flex-col-reverse gap-1 overflow-y-auto rounded-xl border border-gray-400 bg-black px-4'>
          {chat.map(({ roomId, user, msg, time }, key) => (
            <div
              key={key}
              className={
                user == username
                  ? style.chatProfileRight
                  : style.chatProfileLeft
              }
            >
              <span
                className={style.chatProfileSpan}
                style={{ textAlign: user == username ? 'right' : 'left' }}
              >
                {user.charAt(0)}
              </span>
              <h3
                style={{ textAlign: user == username ? 'right' : 'left' }}
                className='rounded-lg border border-gray-900 bg-gray-800 px-4 py-1 text-zinc-50'
              >
                {msg}
              </h3>
            </div>
          ))}
        </div>
        <div>
          <form
            onSubmit={(e) => sendData(e)}
            className='flex w-full items-center justify-center gap-2'
          >
            <input
              className='flex rounded-lg bg-white px-2 py-1 text-neutral-800'
              type='text'
              value={currentMsg}
              placeholder='Type your message..'
              onChange={(e) => setCurrentMsg(e.target.value)}
            />
            <button className={style.chat_button}>Send</button>
          </form>
          {/* <button className={style.chat_button} onClick={(e) => sendStart(e)}>
            Start
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
