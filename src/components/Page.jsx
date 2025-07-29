"use client"
import { SignIn } from "@clerk/clerk-react"

const LandingPage = ({ showSignIn, setShowSignIn }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💬</span>
            <span className="text-xl font-bold text-gray-900">Chat Haven</span>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => setShowSignIn(true)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowSignIn(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Show SignIn modal if requested */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg relative max-w-md w-full mx-4">
            <button
              onClick={() => setShowSignIn(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            <SignIn routing="hash" />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Chat with Friends and AI in One Place</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create chat rooms, connect with people, and get help from our AI assistant. Simple, fast, and free to start.
          </p>
          <button
            onClick={() => setShowSignIn(true)}
            className="text-lg px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Chatting Now
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Chat Haven?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Create Rooms</h3>
              <p className="text-gray-600">Set up custom chat rooms for any topic or group in seconds.</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Real-time Chat</h3>
              <p className="text-gray-600">Instant messaging with your friends and colleagues, no delays.</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">AI Assistant</h3>
              <p className="text-gray-600">Get help anytime with our smart AI chatbot that's always available.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Get Started in 3 Steps</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Sign Up</h3>
              <p className="text-gray-600">Create your free account in seconds. No credit card required.</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Create or Join Rooms</h3>
              <p className="text-gray-600">Start your own chat room or join existing ones that match your interests.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Start Chatting</h3>
              <p className="text-gray-600">
                Connect with people or chat with our AI assistant. The conversation starts now!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Chatting?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of users already using Chat Haven.</p>
          <button
            onClick={() => setShowSignIn(true)}
            className="text-lg px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">💬</span>
            <span className="text-xl font-bold">Chat Haven</span>
          </div>
          <p className="text-gray-400 mb-4">Connecting people and AI in meaningful conversations.</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
