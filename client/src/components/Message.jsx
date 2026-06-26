import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'
import { useAppContext } from '../context/AppContext'

const Message = ({ message }) => {

  const { theme } = useAppContext()

  useEffect(() => {
    Prism.highlightAll()
  }, [message.content])

  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden
          ${isUser
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
            : 'bg-white'
          }
        `}>
          {isUser ? (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <img src={assets.logo} alt="ApexGPT" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Message Bubble */}
        <div className={`
          rounded-2xl px-4 py-3
          ${isUser
            ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-br-md'
            : message.isImage
              ? 'bg-transparent'
              : theme === 'dark'
                ? 'bg-[#111111] text-white rounded-bl-md border border-gray-800'
                : 'bg-white text-gray-900 rounded-bl-md border border-gray-200 shadow-sm'
          }
        `}>
          {/* Image Message */}
          {message.isImage && (
            <div className="mb-2">
              <img
                src={message.content}
                alt="Generated"
                className="max-w-md rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                loading="lazy"
              />
            </div>
          )}

          {/* Text Message */}
          {!message.isImage && (
            <div className={`text-sm leading-relaxed reset-tw
              ${isUser ? '' : 'dark:text-white'}
            `}>
              <Markdown>{message.content}</Markdown>
            </div>
          )}

          {/* Timestamp */}
          <p className={`
            text-xs mt-2
            ${isUser
              ? 'text-white/60'
              : 'text-gray-400 dark:text-gray-500'
            }
          `}>
            {moment(message.timestamp).fromNow()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Message
