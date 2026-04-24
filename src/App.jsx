import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'
import ImageAnalysis from './components/ImageAnalysis'
import ImageGeneration from './components/ImageGeneration'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [activeTab, setActiveTab] = useState('chat')
  const [chats, setChats] = useState([
    { id: 1, title: 'Welcome Chat', messages: [{ role: 'assistant', content: "Welcome to Yuvraj's SamvaadAI! How can I assist you today?" }] }
  ])
  const [currentChatId, setCurrentChatId] = useState(1)

  const currentChat = chats.find(c => c.id === currentChatId)

  const addMessage = (chatId, message) => {
    setChats(prev => prev.map(c => 
      c.id === chatId ? { ...c, messages: [...c.messages, message] } : c
    ))
  }

  const createNewChat = () => {
    const newId = Date.now()
    setChats(prev => [
      ...prev,
      { id: newId, title: 'New Conversation', messages: [{ role: 'assistant', content: 'Hello! I am ready to help.' }] }
    ])
    setCurrentChatId(newId)
    setActiveTab('chat')
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/30">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        chats={chats} 
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        createNewChat={createNewChat}
      />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ChatInterface chat={currentChat} addMessage={addMessage} />
            </motion.div>
          )}
          
          {activeTab === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ImageAnalysis />
            </motion.div>
          )}

          {activeTab === 'generate' && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ImageGeneration />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
