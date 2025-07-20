import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const App = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  // Restore session on load
  useEffect(() => {
    const savedRoom = localStorage.getItem('room');
    const savedUsername = localStorage.getItem('username');

    if (savedRoom && savedUsername) {
      setRoom(savedRoom);
      setUsername(savedUsername);
      socket.emit('join_room', { roomCode: savedRoom, username: savedUsername });
    }
  }, []);

  // Setup socket events
  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('receive_message', (data) => setChat((prev) => [...prev, data]));
    socket.on('previous_messages', (messages) => setChat(messages));

    socket.on('room_created', ({ roomCode, isAdmin }) => {
      setRoom(roomCode);
      setIsAdmin(isAdmin);
      setJoined(true);
      localStorage.setItem('room', roomCode);
      localStorage.setItem('username', username);
    });

    socket.on('joined_room', ({ isAdmin }) => {
      setIsAdmin(isAdmin);
      setJoined(true);
    });

    socket.on('room_exists', () => setError('Room already exists.'));
    socket.on('room_not_found', () => setError('Room not found.'));
    socket.on('room_deleted', () => {
      alert('Room was deleted by the admin.');
      leaveRoom();
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receive_message');
      socket.off('previous_messages');
      socket.off('room_created');
      socket.off('joined_room');
      socket.off('room_exists');
      socket.off('room_not_found');
      socket.off('room_deleted');
    };
  }, [username]);

  const joinRoom = () => {
    setError('');
    if (username && room) {
      localStorage.setItem('room', room);
      localStorage.setItem('username', username);
      socket.emit('join_room', { roomCode: room, username });
    }
  };

  const handleCreate = () => {
    setError('');
    if (!username.trim()) {
      setError('Please enter your username before creating a room.');
      return;
    }
    const newRoom = Math.random().toString(36).substring(2, 8);
    setRoom(newRoom);
    socket.emit('create_room', { roomCode: newRoom, username });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      socket.emit('delete_room', room);
    }
  };

  const leaveRoom = () => {
    localStorage.removeItem('room');
    localStorage.removeItem('username');
    window.location.reload();
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', { message, room, username });
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">💬 The Chat Haven</h1>

        {!joined ? (
          <div className="space-y-4">
            <p className="text-sm text-center">
              Connection status:{' '}
              <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                {isConnected ? 'connected' : 'disconnected'}
              </span>
            </p>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <input
              type="text"
              placeholder="Room Code"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <button
              onClick={joinRoom}
              className="bg-black text-white px-4 py-2 rounded w-full"
            >
              Join Room
            </button>

            <hr className="my-4" />

            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Create Room
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">Room: {room}</h2>
              <div className="space-x-2">
                {isAdmin && (
                  <button
                    onClick={handleDelete}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete Room
                  </button>
                )}
                <button
                  onClick={leaveRoom}
                  className="text-gray-600 text-sm hover:underline"
                >
                  Leave Room
                </button>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded shadow h-64 overflow-y-auto mb-4">
              {chat.map((msg, index) => (
                <div key={index} className="mb-2">
                  <div className="text-sm text-gray-600">
                    [{msg.time}] <strong>{msg.username}:</strong>
                  </div>
                  <div className="p-2 bg-blue-100 rounded">{msg.message}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 border p-2 rounded"
                placeholder="Type your message"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
