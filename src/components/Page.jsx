
import { useState, useEffect } from "react"
import { MessageCircle, Users, Bot, Shield, ArrowRight, Sparkles } from "lucide-react"
import { SignIn, useAuth } from "@clerk/clerk-react"

// React Bits - Blur Text Component
const BlurText = ({ text, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <span
      className={`transition-all duration-1000 ${
        isVisible ? "blur-none opacity-100" : "blur-sm opacity-70"
      } ${className}`}
    >
      {text}
    </span>
  )
}

// React Bits - Text Pressure Component
const TextPressure = ({ children, className = "" }) => {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <span
      className={`inline-block transition-all duration-150 cursor-pointer select-none ${
        isPressed ? "scale-95 brightness-75" : "scale-100 brightness-100"
      } ${className}`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
    </span>
  )
}

// React Bits - Decrypted Text Component
const DecryptedText = ({ text, className = "" }) => {
  const [displayText, setDisplayText] = useState("")
  const [isDecrypting, setIsDecrypting] = useState(true)

  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"

  useEffect(() => {
    let iteration = 0
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join(""),
      )

      if (iteration >= text.length) {
        clearInterval(interval)
        setIsDecrypting(false)
      }

      iteration += 1 / 3
    }, 50)

    return () => clearInterval(interval)
  }, [text])

  return <span className={`font-mono ${className}`}>{displayText}</span>
}

// Rotating Text Component
const RotatingText = ({ words, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [words.length])

  return <span className={`inline-block transition-all duration-500 ${className}`}>{words[currentIndex]}</span>
}

const LandingPage = () => {
  const { isSignedIn } = useAuth()
  const [showSignIn, setShowSignIn] = useState(false)

  const rotatingWords = ["Connect", "Chat", "Collaborate", "Create"]

  const features = [
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Lightning-fast messaging with zero delays",
    },
    {
      icon: Users,
      title: "Private Rooms",
      description: "Secure spaces with military-grade encryption",
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Advanced AI powered by cutting-edge technology",
    },
    {
      icon: Shield,
      title: "Ultra Secure",
      description: "End-to-end encryption for maximum privacy",
    },
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 backdrop-blur-sm bg-white/5 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <TextPressure>
                <span className="text-2xl font-bold text-white">Chat Haven</span>
              </TextPressure>
            </div>
            <TextPressure>
              <button
                onClick={() => setShowSignIn(true)}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl transition-all duration-200"
              >
                Get Started
              </button>
            </TextPressure>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Sparkles className="w-8 h-8 text-indigo-400 mr-3" />
              <BlurText
                text="Welcome to the Future of Communication"
                className="text-indigo-400 font-medium"
                delay={500}
              />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white leading-tight">
              <DecryptedText
                text="SECURE CHAT"
                className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent block mb-4"
              />
              <RotatingText words={rotatingWords} className="text-white/90 text-5xl md:text-6xl" />
            </h1>

            <BlurText
              text="Experience seamless real-time messaging with AI assistance, private rooms, and military-grade security."
              className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed max-w-3xl mx-auto block"
              delay={1000}
            />

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <TextPressure>
                <button
                  onClick={() => setShowSignIn(true)}
                  className="group bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-indigo-500/25 flex items-center space-x-2"
                >
                  <span>Start Chatting</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </TextPressure>
              <TextPressure>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200">
                  Learn More
                </button>
              </TextPressure>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <BlurText
              text="Everything You Need"
              className="text-4xl md:text-5xl font-bold mb-6 text-white block"
              delay={200}
            />
            <BlurText
              text="Advanced features designed for modern secure communication"
              className="text-xl text-white/60 max-w-2xl mx-auto block"
              delay={400}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <TextPressure key={index}>
                <div className="group backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <BlurText
                    text={feature.description}
                    className="text-white/60 text-sm leading-relaxed"
                    delay={index * 200 + 600}
                  />
                </div>
              </TextPressure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <TextPressure>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-12 hover:bg-white/8 transition-all duration-300">
              <DecryptedText text="READY TO START?" className="text-4xl md:text-5xl font-bold mb-6 text-white block" />
              <BlurText
                text="Join thousands of users already using Chat Haven for secure communication."
                className="text-xl text-white/70 mb-8 max-w-2xl mx-auto block"
                delay={800}
              />

              <TextPressure>
                <button
                  onClick={() => setShowSignIn(true)}
                  className="group bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-indigo-500/25 flex items-center space-x-2 mx-auto"
                >
                  <span>Start Free Today</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </TextPressure>

              <div className="flex items-center justify-center space-x-8 mt-8 text-white/50 text-sm">
                <BlurText text="✓ Free to start" delay={1200} />
                <BlurText text="✓ No credit card required" delay={1400} />
                <BlurText text="✓ Military-grade security" delay={1600} />
              </div>
            </div>
          </TextPressure>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-sm bg-white/5 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <TextPressure>
                <span className="text-xl font-bold text-white">Chat Haven</span>
              </TextPressure>
            </div>
            <div className="flex items-center space-x-6 text-white/50 text-sm">
              <TextPressure>
                <button className="hover:text-white transition-colors duration-200">Privacy</button>
              </TextPressure>
              <TextPressure>
                <button className="hover:text-white transition-colors duration-200">Terms</button>
              </TextPressure>
              <TextPressure>
                <button className="hover:text-white transition-colors duration-200">Support</button>
              </TextPressure>
            </div>
          </div>
          <div className="border-t border-white/10 mt-6 pt-6 text-center text-white/40 text-sm">
            <BlurText text="© 2024 Chat Haven. All rights reserved." delay={2000} />
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <TextPressure>
            <div className="backdrop-blur-sm bg-black/80 border border-white/20 rounded-2xl p-8 shadow-2xl max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <DecryptedText text="GET STARTED" className="text-2xl font-bold text-white" />
                <TextPressure>
                  <button
                    onClick={() => setShowSignIn(false)}
                    className="text-white/60 hover:text-white transition-colors duration-200 text-2xl"
                  >
                    ×
                  </button>
                </TextPressure>
              </div>
              <SignIn routing="hash" />
            </div>
          </TextPressure>
        </div>
      )}
    </div>
  )
}

export default LandingPage
