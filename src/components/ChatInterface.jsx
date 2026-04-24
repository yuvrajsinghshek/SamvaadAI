import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, User, Bot } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { sendMessage } from '../lib/api'

export default function ChatInterface({ chat, addMessage }) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chat.messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input }
    addMessage(chat.id, userMessage)
    setInput('')
    setIsLoading(true)

    try {
      const response = await sendMessage([...chat.messages, userMessage])
      addMessage(chat.id, { role: 'assistant', content: response })
    } catch (error) {
      addMessage(chat.id, { role: 'assistant', content: 'Sorry, I encountered an error. Please check your API key.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-grid-pattern bg-grid-size relative">
      <header className="h-16 flex items-center px-8 border-b border-white/5 bg-background/50 backdrop-blur-sm z-10">
        <h2 className="text-lg font-semibold text-white/90 flex items-center gap-2">
          <Sparkles className="text-primary w-5 h-5" />
          SamvaadAI
        </h2>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-10 space-y-6">
        <AnimatePresence initial={false}>
          {chat.messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-primary' : 'bg-gray-800'
                }`}>
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className={`px-5 py-4 rounded-2xl text-sm leading-relaxed prose prose-invert max-w-none ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white shadow-xl shadow-primary/10' 
                    : 'glass-card text-gray-200'
                }`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-4 overflow-hidden">
                 <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center animate-pulse">
                    <Bot size={18} />
                 </div>
                 <div className="px-5 py-4 rounded-2xl glass-card animate-pulse-soft">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-8 pb-10">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-gray-900/50 border border-white/10 text-white rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300 placeholder:text-gray-600"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 px-4 bg-primary hover:bg-accent text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:grayscale flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
