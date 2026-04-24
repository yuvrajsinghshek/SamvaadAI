import React from 'react'
import { MessageSquare, Image, Rocket, Plus, Trash2, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Sidebar({ activeTab, setActiveTab, chats, currentChatId, setCurrentChatId, createNewChat }) {
  return (
    <aside className="w-80 h-full glass border-r border-white/5 flex flex-col z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">SamvaadAI</h1>
        </div>

        <nav className="space-y-1.5">
          <NavItem 
            icon={<MessageSquare size={18} />} 
            label="Chat" 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
          />
          <NavItem 
            icon={<Image size={18} />} 
            label="Analysis" 
            active={activeTab === 'analysis'} 
            onClick={() => setActiveTab('analysis')} 
          />
          <NavItem 
            icon={<Rocket size={18} />} 
            label="Generate" 
            active={activeTab === 'generate'} 
            onClick={() => setActiveTab('generate')} 
          />
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        <div className="flex items-center justify-between px-2 mb-3 mt-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Chats</span>
          <button 
            onClick={createNewChat}
            className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => {
              setCurrentChatId(chat.id)
              setActiveTab('chat')
            }}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group flex items-center justify-between ${
              currentChatId === chat.id && activeTab === 'chat'
                ? 'bg-primary/20 text-primary border border-primary/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <span className="truncate text-sm font-medium">{chat.title}</span>
          </button>
        ))}
      </div>

      <div className="p-6 border-t border-white/5">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Made by</p>
          <p className="text-sm font-bold text-white leading-tight">Yuvraj Singh Shekhawat</p>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.1em]">Data Scientist</p>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group ${
        active 
          ? 'text-white' 
          : 'text-gray-400 hover:text-gray-200'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="nav-bg"
          className="absolute inset-0 bg-gradient-to-r from-primary to-primary/40 rounded-xl shadow-lg shadow-primary/20"
        />
      )}
      <div className={`relative z-10 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className="relative z-10 font-medium text-sm">{label}</span>
    </button>
  )
}
