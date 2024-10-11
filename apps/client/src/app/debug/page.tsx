'use client';

import { useEffect, useState } from 'react';

import { socket } from '../../socket';
import ChatPage from './chat';
import styles from './page.module.css';

export default function DebugPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');
  const [showChat, setShowChat] = useState(false);
  const [userName, setUserName] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const [roomId, setRoomId] = useState(-999);

  const handleJoin = () => {
    if (userName !== '' && roomId !== -999) {
      socket.emit('join_lobby', { userName, roomId });
      setShowSpinner(true);

      setTimeout(() => {
        setShowChat(true);
        setShowSpinner(false);
      }, 4000);
    } else {
      alert('Please fill in Username and Room ID');
    }
  };

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div>
      <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
      <p>Transport: {transport}</p>

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
          <ChatPage socket={socket} roomId={roomId} username={userName} />
        </div>
      </div>
    </div>
  );
}
