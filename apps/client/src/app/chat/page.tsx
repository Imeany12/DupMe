'use client';

import { useState } from 'react';

import ChatPage from '@/components/page';
import { socket } from '@/socket';

import styles from './page.module.css';

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [userName, setUserName] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const [roomId, setRoomId] = useState('');

  const handleJoin = () => {
    if (userName !== '' && roomId !== '') {
      socket.emit('join_room', roomId);
      setShowSpinner(true);

      setTimeout(() => {
        setShowChat(true);
        setShowSpinner(false);
      }, 4000);
    } else {
      alert('Please fill in Username and Room Id');
    }
  };

  return (
    <div>
      <div
        className={styles.main_div}
        style={{ display: showChat ? 'none' : '' }}
      >
        <input
          className={styles.main_input}
          type='text'
          placeholder='Username'
          onChange={(e) => setUserName(e.target.value)}
          disabled={showSpinner}
        />
        <input
          className={styles.main_input}
          type='text'
          placeholder='room id'
          onChange={(e) => setRoomId(e.target.value)}
          disabled={showSpinner}
        />
        <button className={styles.main_button} onClick={() => handleJoin()}>
          {!showSpinner ? (
            'Join'
          ) : (
            <div className={styles.loading_spinner}></div>
          )}
        </button>
      </div>
      <div style={{ display: !showChat ? 'none' : '' }}>
        <ChatPage socket={socket} roomId={roomId} username={userName} />
      </div>
    </div>
  );
}
