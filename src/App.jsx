"use client"

import { useEffect, useState, useRef } from "react"
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
  const [typingUsers, setTypingUsers] = useState([]) // New state for typing users
  const [isTyping, setIsTyping] = useState(false) // Track if current user is typing
  const chatEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat])

  // Setup socket connection with JWT
  useEffect(() => {
    const setupSocket = async () => {
      const token = await getToken({ template: "socket" })
      if (!token) {
        console.error("❌ Failed to get JWT token from Clerk.")
        return
      }
      //console.log("✅ Clerk Token:", token)
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

    // Typing indicators
    socket.on("user_typing", ({ username }) => {
      setTypingUsers((prev) => {
        if (!prev.includes(username) && username !== user.fullName) {
          return [...prev, username]
        }
        return prev
      })
    })

    socket.on("user_stopped_typing", ({ username }) => {
      setTypingUsers((prev) => prev.filter((user) => user !== username))
    })

    return () => {
      socket.off("receive_message")
      socket.off("previous_messages")
      socket.off("room_created")
      socket.off("joined_room")
      socket.off("room_exists")
      socket.off("room_not_found")
      socket.off("room_deleted")
      socket.off("update_users")
      socket.off("user_typing")
      socket.off("user_stopped_typing")
    }
  }, [user.fullName])

  // Handle typing indicator
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true)
      socket.emit("typing", { room, username: user.fullName })
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      socket.emit("stop_typing", { room, username: user.fullName })
    }, 2000)
  }

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
      // Stop typing when message is sent
      if (isTyping) {
        setIsTyping(false)
        socket.emit("stop_typing", { room, username: user.fullName })
      }
    }
  }

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      socket.disconnect()
      signOut()
    }
  }

  // Handle Enter key press for sending messages
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  // Handle message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value)
    handleTyping()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-t-2xl shadow-lg border-b border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">The Chat Haven</h1>
                  <p className="text-sm text-gray-500">Connect, Chat, Create</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{user.firstName || user.fullName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {!joined ? (
            /* Room Selection */
            <div className="bg-white rounded-b-2xl shadow-lg p-8">
              <div className="max-w-md mx-auto space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Join the Conversation</h2>
                  <p className="text-gray-600">Enter a room code or create your own space</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Code</label>
                    <input
                      type="text"
                      placeholder="Enter room code..."
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <button
                    onClick={joinRoom}
                    className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Join Room
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={handleCreate}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    🏠 Create New Room
                  </button>
                  <button
                    onClick={handleJoinAI}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    🤖 Chat with AI Assistant
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Chat Interface */
            <div className="bg-white rounded-b-2xl shadow-lg overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">Room: {room}</h2>
                    {room === "ai-assistant" && <p className="text-blue-100 text-sm">🤖 Chatting with Gemini AI</p>}
                  </div>
                  <div className="flex items-center space-x-3">
                    {isAdmin && room !== "ai-assistant" && (
                      <button
                        onClick={handleDelete}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete Room
                      </button>
                    )}
                    <button
                      onClick={leaveRoom}
                      className="px-3 py-1 bg-white bg-opacity-20 text-white rounded text-sm hover:bg-opacity-30 transition-colors"
                    >
                      Leave Room
                    </button>
                  </div>
                </div>
              </div>

              {/* Online Users */}
              <div className="bg-gray-50 px-4 py-2 border-b">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Online:</span>
                  <div className="flex flex-wrap gap-2">
                    {userList.map((u, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {chat.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.username === user.fullName ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        msg.username === user.fullName
                          ? "bg-blue-500 text-white"
                          : msg.username === "AI Bot"
                            ? "bg-purple-500 text-white"
                            : "bg-white text-gray-800 shadow-md"
                      }`}
                    >
                      {msg.username !== user.fullName && (
                        <div className="text-xs opacity-75 mb-1">
                          {msg.username} • {msg.time}
                        </div>
                      )}
                      <div className="text-sm">{msg.message}</div>
                      {msg.username === user.fullName && (
                        <div className="text-xs opacity-75 mt-1 text-right">{msg.time}</div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 px-4 py-2 rounded-2xl max-w-xs">
                      <div className="flex items-center space-x-1">
                        <div className="text-sm text-gray-600">
                          {typingUsers.length === 1
                            ? `${typingUsers[0]} is typing`
                            : `${typingUsers.length} people are typing`}
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t">
                <div className="flex space-x-3">
                  <input
                    value={message}
                    onChange={handleMessageChange}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={sendMessage}
                    className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
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
