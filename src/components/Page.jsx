"use client"
import { SignIn } from "@clerk/clerk-react"

const LandingPage = ({ showSignIn, setShowSignIn }) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">The Chat Haven</span>
              <p className="text-xs text-gray-500">Connect • Chat • Create</p>
            </div>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => setShowSignIn(true)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowSignIn(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Show SignIn modal if requested */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl relative max-w-md w-full mx-4 shadow-2xl">
            <button
              onClick={() => setShowSignIn(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
            >
              ×
            </button>
            <SignIn routing="hash" />
          </div>
        </div>
      )}

      {/* Hero Section with Background Image */}
      <section
        className="relative py-32 px-4 min-h-screen flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/hero-background.jpeg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70"></div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium mb-8 border border-white/30">
              🚀 Now with AI Assistant
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Chat with Friends and{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              AI in One Place
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create chat rooms, connect with people, and get help from our AI assistant. Simple, fast, and free to start.
          </p>
          <button
            onClick={() => setShowSignIn(true)}
            className="text-lg px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
          >
            Start Chatting Now
          </button>
        </div>

        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>

      {/* Features Section with Background */}
      <section
        className="relative py-20 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('/images/features-background.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose Chat Haven?</h2>
            <p className="text-xl text-gray-600">Everything you need for seamless communication</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 hover:-translate-y-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Create Rooms</h3>
              <p className="text-gray-600 leading-relaxed">
                Set up custom chat rooms for any topic or group in seconds. Perfect for teams, friends, or communities.
              </p>
            </div>

            <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 hover:-translate-y-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Real-time Chat</h3>
              <p className="text-gray-600 leading-relaxed">
                Instant messaging with typing indicators, online status, and seamless message delivery.
              </p>
            </div>

            <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 hover:-translate-y-4">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">AI Assistant</h3>
              <p className="text-gray-600 leading-relaxed">
                Get help anytime with our smart AI chatbot powered by Gemini. Always available, always helpful.
              </p>
            </div>
          </div>
        </div>
      </section>

      

      {/* How it Works Section */}
      <section
        className="relative py-20 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/images/steps-background.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get Started in 3 Simple Steps</h2>
            <p className="text-xl text-gray-600">Join thousands of users in minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Sign Up</h3>
              <p className="text-gray-600 leading-relaxed">
                Create your free account in seconds. No credit card required, just your email.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-8">
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Create or Join Rooms</h3>
              <p className="text-gray-600 leading-relaxed">
                Start your own chat room or join existing ones that match your interests and needs.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-8">
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Start Chatting</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with people or chat with our AI assistant. The conversation starts now!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Background */}
      <section
        className="relative py-20 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.9)), url('/images/cta-background.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start Chatting?</h2>
          <p className="text-xl text-blue-100 mb-12">
            Join thousands of users already using Chat Haven for their daily conversations.
          </p>
          <button
            onClick={() => setShowSignIn(true)}
            className="text-lg px-10 py-5 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative py-12 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.95)), url('/images/footer-background.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <span className="text-2xl">💬</span>
              </div>
              <span className="text-2xl font-bold text-white">Chat Haven</span>
            </div>
            <p className="text-gray-300 mb-8 text-lg">Connecting people and AI in meaningful conversations.</p>
            <div className="flex justify-center space-x-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
