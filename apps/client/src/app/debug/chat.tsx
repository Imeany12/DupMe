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

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
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
      await socket.emit('send_msg', msgData);
      setChat((pre) => [...pre, msgData]);
      setCurrentMsg('');
    }
  };

  useEffect(() => {
    socket.on('receive_msg', (data: IMsgDataTypes) => {
      setChat((pre) => [...pre, data]);
    });

    return () => socket.off('receive_msg'); // Don't forget to clean up!
  }, [socket]);

  return (
    <div className={style.chat_div}>
      <div className={style.chat_border}>
        <div style={{ marginBottom: '1rem' }}>
          <p>
            Name: <b>{username}</b> and Room Id: <b>{roomId}</b>
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
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
