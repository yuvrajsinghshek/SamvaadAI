import React, { useState } from 'react'
import { Upload, ImageIcon, ScanSearch, History } from 'lucide-react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { analyzeImage } from '../lib/api'

export default function ImageAnalysis() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const runAnalysis = async (type) => {
    if (!preview) return
    setIsLoading(true)
    const base64 = preview.split(',')[1]
    
    const prompts = {
      summary: "Describe this image clearly and concisely in one powerful sentence.",
      objects: "List every visible object in the image with a short description of each.",
      story: "Write a short, beautiful, emotional story inspired by this image."
    }

    try {
      const resp = await analyzeImage(prompts[type], base64)
      setResult(resp)
    } catch (err) {
      setResult("Error analyzing image. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto bg-grid-pattern bg-grid-size">
      <div className="max-w-4xl mx-auto w-full space-y-8 mt-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white mb-3">SamvaadAI Analysis</h1>
          <p className="text-gray-400">Unlock insights from your visual content using AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className={`aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden ${
              preview ? 'border-primary' : 'border-white/10 hover:border-white/20'
            }`}>
              {preview ? (
                <img src={preview} alt="Upload" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-8">
                  <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Drop your image here or browse</p>
                </div>
              )}
              <input 
                type="file" 
                onChange={handleImageChange} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <AnalysisBtn onClick={() => runAnalysis('summary')} icon={<ScanSearch size={18} />} label="Summary" disabled={!preview || isLoading} />
              <AnalysisBtn onClick={() => runAnalysis('objects')} icon={<ImageIcon size={18} />} label="Objects" disabled={!preview || isLoading} />
              <AnalysisBtn onClick={() => runAnalysis('story')} icon={<History size={18} />} label="Story" disabled={!preview || isLoading} />
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 min-h-[400px] relative overflow-hidden">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="text-primary w-5 h-5" />
              Analysis Result
            </h3>
            
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-white/5 rounded-full w-3/4" />
                <div className="h-4 bg-white/5 rounded-full w-full" />
                <div className="h-4 bg-white/5 rounded-full w-5/6" />
              </div>
            ) : result ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
              >
                <ReactMarkdown>{result}</ReactMarkdown>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600 text-center italic">
                Select an image and analysis type to get started
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalysisBtn({ onClick, icon, label, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
        disabled 
          ? 'bg-white/2 border-white/5 text-gray-700 opacity-50 cursor-not-allowed' 
          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-primary/20 hover:border-primary/50 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  )
}

function Sparkles({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
    </svg>
  )
}
