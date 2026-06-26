import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import toast from 'react-hot-toast'

const ChatBox = () => {

  const containerRef = useRef(null)

  const { selectedChat, theme, user, axios, token, setUser } = useAppContext()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [isPublished, setIsPublished] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!user) return toast('Login to send message')
      if (!prompt.trim()) return

      setLoading(true)
      const promptCopy = prompt
      setPrompt('')
      setMessages(prev => [...prev, { role: 'user', content: prompt, timestamp: Date.now(), isImage: false }])

      const { data } = await axios.post(`/api/message/${mode}`, {
        chatId: selectedChat._id,
        prompt,
        isPublished
      }, {
        headers: { Authorization: token }
      })

      if (data.success) {
        setMessages(prev => [...prev, data.reply])
        if (mode === 'image') {
          setUser(prev => ({ ...prev, credits: prev.credits - 2 }))
        } else {
          setUser(prev => ({ ...prev, credits: prev.credits - 1 }))
        }
      } else {
        toast.error(data.message)
        setPrompt(promptCopy)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages)
    }
  }, [selectedChat])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <header className={`
        flex items-center justify-between px-6 py-4 border-b
        ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
        ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}
      `}>
        <h1 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {selectedChat?.name || 'New Chat'}
        </h1>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {user?.credits || 0} credits
          </span>
        </div>
      </header>

      {/* Messages Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-6 animate-fade-in">
            {/* Logo */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={theme === 'dark' ? assets.logo_full : assets.logo_full}
                alt="ApexGPT"
                className="w-28 h-auto"
              />
              <h2 className={`text-4xl font-bold tracking-tight
                ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
              `}>
                ApexGPT
              </h2>
            </div>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              How can I help you today?
            </p>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </div>

        {loading && (
          <div className="flex items-center gap-2 px-4">
            <div className="flex gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full animate-bounce ${theme === 'dark' ? 'bg-emerald-500' : 'bg-gray-600'}`}></span>
              <span className={`w-2.5 h-2.5 rounded-full animate-bounce [animation-delay:150ms] ${theme === 'dark' ? 'bg-emerald-500' : 'bg-gray-600'}`}></span>
              <span className={`w-2.5 h-2.5 rounded-full animate-bounce [animation-delay:300ms] ${theme === 'dark' ? 'bg-emerald-500' : 'bg-gray-600'}`}></span>
            </div>
          </div>
        )}
      </div>

      {/* Image Publish Toggle */}
      {mode === "image" && (
        <div className={`px-4 pb-2 flex items-center justify-center gap-3
          ${theme === 'dark' ? '' : ''}
        `}>
          <label className={`text-sm font-medium cursor-pointer
            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
          `}>
            Publish to Community
          </label>
          <button
            onClick={() => setIsPublished(!isPublished)}
            className={`
              relative w-12 h-6 rounded-full transition-colors duration-200
              ${isPublished
                ? 'bg-emerald-500'
                : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
              }
            `}
          >
            <span className={`
              absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
              ${isPublished ? 'translate-x-7' : 'translate-x-1'}
            `} />
          </button>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={onSubmit}
        className={`
          px-4 pb-4 pt-2
          ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}
        `}
      >
        <div className={`
          flex items-center gap-3 p-2 rounded-2xl border
          ${theme === 'dark'
            ? 'bg-[#111111] border-gray-800'
            : 'bg-gray-50 border-gray-200'
          }
          focus-within:border-emerald-500 transition-colors
        `}>
          {/* Mode Selector */}
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className={`
              bg-transparent outline-none text-sm font-medium cursor-pointer px-2 py-1 rounded-lg
              ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'}
            `}
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>

          {/* Input */}
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Message ApexGPT..."
            className={`
              flex-1 bg-transparent outline-none text-base
              ${theme === 'dark'
                ? 'text-white placeholder:text-gray-500'
                : 'text-gray-900 placeholder:text-gray-400'
              }
            `}
            disabled={loading}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              transition-all duration-200
              ${prompt.trim() && !loading
                ? theme === 'dark'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20'
                  : 'bg-gray-900 hover:bg-gray-800 shadow-lg shadow-gray-900/20'
                : theme === 'dark'
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>

        <p className={`text-xs text-center mt-2
          ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}
        `}>
          ApexGPT can make mistakes. Consider checking important information.
        </p>
      </form>
    </div>
  )
}

export default ChatBox
