"use client"

import { useEffect, useState } from "react"
import LandingPage from "./components/Page"
import { io } from "socket.io-client"
import { SignedIn, SignedOut, useUser, useAuth, useClerk } from "@clerk/clerk-react"

const env_type = import.meta.env.VITE_ENV_TYPE
const backend_url =
  env_type === "PROD" ? import.meta.env.VITE_DEPLOYED_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL

const socket = io(backend_url, {
  autoConnect: false,
  transports: ["websocket"],
})

const Chat = ({ user }) => {
  const { getToken } = useAuth()
  const { signOut } = useClerk()
  const [room, setRoom] = useState("")
  const [joined, setJoined] = useState(false)
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [userList, setUserList] = useState([])
  const [error, setError] = useState("")

  // Setup socket connection with JWT
  useEffect(() => {
    const setupSocket = async () => {
      const token = await getToken({ template: "socket" })
      if (!token) {
        console.error("❌ Failed to get JWT token from Clerk.")
        return
      }
      console.log("✅ Clerk Token:", token)
      socket.auth = { token }
      socket.connect()
    }

    setupSocket()

    return () => {
      socket.disconnect()
    }
  }, [getToken])

  // Setup socket event listeners
  useEffect(() => {
    socket.on("receive_message", (data) => setChat((prev) => [...prev, data]))
    socket.on("previous_messages", (msgs) => setChat(msgs))
    socket.on("room_created", ({ roomCode, isAdmin }) => {
      setRoom(roomCode)
      setIsAdmin(isAdmin)
      setJoined(true)
    })
    socket.on("joined_room", ({ isAdmin }) => {
      setIsAdmin(isAdmin)
      setJoined(true)
    })
    socket.on("room_exists", () => setError("Room already exists."))
    socket.on("room_not_found", () => setError("Room not found."))
    socket.on("room_deleted", () => {
      alert("Room deleted by admin.")
      leaveRoom()
    })
    socket.on("update_users", (users) => setUserList(users))

    return () => {
      socket.off("receive_message")
      socket.off("previous_messages")
      socket.off("room_created")
      socket.off("joined_room")
      socket.off("room_exists")
      socket.off("room_not_found")
      socket.off("room_deleted")
      socket.off("update_users")
    }
  }, [])

  // Room and Message Handlers
  const joinRoom = () => {
    setError("")
    if (room) {
      socket.emit("join_room", { roomCode: room, username: user.fullName })
    }
  }

  const handleCreate = () => {
    setError("")
    const newRoom = Math.random().toString(36).substring(2, 8)
    setRoom(newRoom)
    socket.emit("create_room", { roomCode: newRoom, username: user.fullName })
  }

  const handleJoinAI = () => {
    setRoom("ai-assistant")
    socket.emit("join_room", { roomCode: "ai-assistant", username: user.fullName })
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      socket.emit("delete_room", room)
    }
  }

  const leaveRoom = () => {
    window.location.reload()
  }

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", {
        message,
        room,
        username: user.fullName,
      })
      setMessage("")
    }
  }

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      socket.disconnect() // Disconnect socket before logout
      signOut()
    }
  }

  // Handle Enter key press for sending messages
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">💬 The Chat Haven</h1>
          <div className="flex items-center space-x-3">
            {/* User greeting */}
            <span className="text-sm text-gray-600">Hi, {user.firstName || user.fullName}!</span>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {!joined ? (
          <div className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <input
              type="text"
              placeholder="Room Code"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <button
              onClick={joinRoom}
              className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800 transition-colors"
            >
              Join Room
            </button>
            <hr className="my-4" />
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition-colors"
            >
              Create Room
            </button>
            <button
              onClick={handleJoinAI}
              className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition-colors"
            >
              Chat with AI 🤖
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">Room: {room}</h2>
              <div className="space-x-2">
                {isAdmin && room !== "ai-assistant" && (
                  <button onClick={handleDelete} className="text-red-600 text-sm hover:underline">
                    Delete Room
                  </button>
                )}
                <button onClick={leaveRoom} className="text-gray-600 text-sm hover:underline">
                  Leave Room
                </button>
              </div>
            </div>

            {room === "ai-assistant" && (
              <p className="text-sm text-green-600 italic">🤖 You are chatting with Gemini AI</p>
            )}

            <div className="mb-2">
              <h2 className="font-semibold">Online Users:</h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {userList.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-100 p-4 rounded shadow h-64 overflow-y-auto mb-4">
              {chat.map((msg, index) => (
                <div key={index} className="mb-2">
                  <div className={`text-sm ${msg.username === "AI Bot" ? "text-purple-600" : "text-gray-600"}`}>
                    [{msg.time}] <strong>{msg.username}:</strong>
                  </div>
                  <div className={`p-2 rounded ${msg.username === "AI Bot" ? "bg-purple-100" : "bg-blue-100"}`}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border p-2 rounded"
                placeholder="Type your message"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const App = () => {
  const { user } = useUser()
  const [showSignIn, setShowSignIn] = useState(false)

  return (
    <>
      <SignedOut>
        <LandingPage showSignIn={showSignIn} setShowSignIn={setShowSignIn} />
      </SignedOut>
      <SignedIn>
        <Chat user={user} />
      </SignedIn>
    </>
  )
}

export default App
