import React, { useState } from 'react'
import { Sparkles, Download, Wand2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateImage } from '../lib/api'

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)
    setError(null)
    setImage(null)

    try {
      const imageUrl = await generateImage(prompt)
      setImage(imageUrl)
    } catch (err) {
      setError("Failed to generate image. Please check your API key and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const downloadImage = () => {
    if (!image) return
    const link = document.createElement('a')
    link.href = image
    link.download = `generated-image-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto bg-grid-pattern bg-grid-size">
      <div className="max-w-4xl mx-auto w-full space-y-8 mt-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
            SamvaadAI <span className="text-gradient">Artisan</span>
          </h1>
          <p className="text-gray-400">Transform your imagination into stunning visuals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="relative group">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to create in detail..."
                  className="w-full bg-gray-900/50 border border-white/10 text-white rounded-3xl px-6 py-5 min-h-[160px] focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300 placeholder:text-gray-600 resize-none"
                />
                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                  Prompt
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-500 shadow-xl shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:grayscale group"
              >
                <Wand2 className={`w-5 h-5 transition-transform duration-500 ${isLoading ? 'animate-spin' : 'group-hover:rotate-12'}`} />
                {isLoading ? 'Generating Masterpiece...' : 'Create Visual'}
              </button>
            </form>

            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
               <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                 <Sparkles size={12} className="text-primary" />
                 Pro Tips
               </h4>
               <ul className="text-sm text-gray-400 space-y-2 leading-relaxed">
                 <li>• Be specific about <span className="text-white">lighting, style, and mood</span>.</li>
                 <li>• Try keywords like <span className="text-white">cinematic, 8k, photorealistic</span>.</li>
                 <li>• Define the <span className="text-white">camera angle</span> and focal length.</li>
               </ul>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-4 min-h-[400px] flex flex-col relative overflow-hidden group/card shadow-2xl">
            <div className={`flex-1 rounded-2xl overflow-hidden bg-white/2 border border-white/5 flex items-center justify-center relative transition-all duration-700 ${image ? 'p-0' : 'p-8'}`}>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-6"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="text-primary animate-pulse w-8 h-8" />
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-white font-semibold animate-pulse">Dreaming...</p>
                      <p className="text-xs text-gray-500 max-w-[200px]">Our AI is weaving pixels into reality</p>
                    </div>
                  </motion.div>
                ) : image ? (
                  <motion.div
                    key="image"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full relative group/img"
                  >
                    <img src={image} alt="Generated" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-4">
                      <button 
                        onClick={downloadImage}
                        className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg"
                        title="Download Image"
                      >
                        <Download size={24} />
                      </button>
                    </div>
                  </motion.div>
                ) : error ? (
                   <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center px-6"
                   >
                     <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                       <span className="text-2xl font-bold">!</span>
                     </div>
                     <p className="text-red-400 text-sm">{error}</p>
                   </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto group-hover/card:scale-110 transition-transform duration-500">
                      <Sparkles className="text-gray-600 w-10 h-10 group-hover/card:text-primary transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-500 font-medium tracking-tight">Your vision will appear here</p>
                      <p className="text-[10px] text-gray-700 uppercase font-black tracking-widest">Awaiting prompt</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {image && (
               <div className="mt-4 flex items-center justify-between px-2">
                 <p className="text-xs text-gray-500 font-medium truncate max-w-[200px]">"{prompt}"</p>
                 <span className="text-[10px] font-black text-primary uppercase tracking-widest">High Res</span>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
