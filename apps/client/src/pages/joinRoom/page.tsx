'use clinent';

import { useState } from 'react';

import ChatPage from '../chat/page';
import styles from './page.module.css';

const JoinRoomPage = ({ socket }: { socket: any }) => {
  const [showChat, setShowChat] = useState(false);
  const [username, setUsername] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const [roomId, setRoomId] = useState(-999);

  function handleJoin() {
    if (username !== '' && roomId !== -999) {
      socket.emit('join_lobby', { username, roomId });
      setShowSpinner(true);

      setTimeout(() => {
        setShowChat(true);
        setShowSpinner(false);
      }, 4000);
    } else {
      alert('Please fill in username and Room ID');
    }
  }

  return (
    <div>
      <div
        className={styles.main_div}
        style={{ display: showChat ? 'none' : '' }}
      >
        <input
          className={styles.main_input}
          type='text'
          placeholder='username'
          onChange={(e) => setUsername(e.target.value)}
          disabled={showSpinner}
        />
        <input
          className={styles.main_input}
          type='text'
          placeholder='room id'
          onChange={(e) => setRoomId(parseInt(e.target.value))}
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
        <ChatPage socket={socket} roomId={roomId} username={username} />
      </div>
    </div>
  );
};

export default JoinRoomPage;
