'use client';
import React, { useEffect, useState } from 'react';

import style from './chat.module.css';

interface IMsgDataTypes {
  roomId: string | number;
  user: string;
  msg: string;
  time: string;
}

const ChatPage = ({
  socket,
  username,
  roomId,
}: {
  socket: any;
  username: string;
  roomId: number;
}) => {
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
      setChat((pre) => [...pre, msgData]);
      setCurrentMsg('');
    }
  };

  const sendStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    socket.emit('start_game', roomId);
  };

  useEffect(() => {
    socket.on('receive_msg', (data: IMsgDataTypes) => {
      setChat((pre) => [...pre, data]);
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
    <div className={style.chat_div}>
      <div className={style.chat_border}>
        <div style={{ marginBottom: '1rem' }}>
          <p>
            Name: <b>{username}</b> and Room Id: <b>{roomId}</b>
          </p>
          <p>
            Online Players: <b>{onlinePlayers}</b>
          </p>
        </div>
        <div>
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
              <h3 style={{ textAlign: user == username ? 'right' : 'left' }}>
                {msg}
              </h3>
            </div>
          ))}
        </div>
        <div>
          <form onSubmit={(e) => sendData(e)}>
            <input
              className={style.chat_input}
              type='text'
              value={currentMsg}
              placeholder='Type your message..'
              onChange={(e) => setCurrentMsg(e.target.value)}
            />
            <button className={style.chat_button}>Send</button>
          </form>
          <button className={style.chat_button} onClick={(e) => sendStart(e)}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
