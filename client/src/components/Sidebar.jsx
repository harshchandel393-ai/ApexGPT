import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'
import toast from 'react-hot-toast'

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {

  const {
    chats,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
    createNewChat,
    axios,
    setChats,
    fetchUserChats,
    setToken,
    token
  } = useAppContext()

  const [search, setSearch] = useState('')

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    toast.success('Logged out successfully')
  }

  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation()
      const confirm = window.confirm('Are you sure you want to delete this chat?')
      if (!confirm) return
      const { data } = await axios.post('/api/chat/delete', { chatId }, {
        headers: { Authorization: token }
      })
      if (data.success) {
        setChats(prev => prev.filter(chat => chat._id !== chatId))
        await fetchUserChats()
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <aside
      className={`
        flex flex-col h-full
        ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-white text-gray-900'}
        ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
        border-r transition-all duration-300 ease-in-out
        max-md:fixed max-md:left-0 max-md:top-0 max-md:bottom-0 max-md:z-50 max-md:w-72
        max-md:shadow-2xl
        ${isMenuOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}
        w-72 shrink-0
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-inherit">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={theme === 'dark' ? assets.logo_full : assets.logo_full}
            alt="ApexGPT"
            className="h-10 w-auto"
          />
        </div>

        {/* Close button (mobile only) */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className={`
            p-2 rounded-lg transition-colors md:hidden
            ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
          `}
          aria-label="Close sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`
            p-2 rounded-lg transition-colors
            ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
          `}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={createNewChat}
          className={`
            flex items-center justify-center gap-2 w-full py-3 rounded-xl
            font-semibold text-sm transition-all duration-200
            shadow-md hover:shadow-lg active:scale-[0.98]
            ${theme === 'dark'
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
            }
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className={`mx-4 p-3 rounded-xl border transition-colors
        ${theme === 'dark'
          ? 'bg-[#111111] border-gray-800'
          : 'bg-gray-50 border-gray-200'
        }
      `}>
        <div className="flex items-center gap-2">
          <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations"
            className={`
              w-full bg-transparent outline-none text-sm
              ${theme === 'dark'
                ? 'text-white placeholder:text-gray-500'
                : 'text-gray-900 placeholder:text-gray-400'
              }
            `}
          />
        </div>
      </div>

      {/* Recent Chats */}
      <div className="flex-1 overflow-y-auto mt-4 px-2">
        {chats?.length > 0 && (
          <p className={`px-2 py-2 text-xs font-semibold uppercase tracking-wider
            ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}
          `}>
            Recent Chats
          </p>
        )}

        <div className="space-y-1">
          {(chats || [])
            .filter((chat) =>
              chat.messages?.[0]
                ? chat.messages[0]?.content?.toLowerCase().includes(search.toLowerCase())
                : chat.name?.toLowerCase().includes(search.toLowerCase())
            )
            .map((chat) => (
              <div
                key={chat._id}
                onClick={() => {
                  navigate('/')
                  setSelectedChat(chat)
                  setIsMenuOpen(false)
                }}
                className={`
                  group p-3 rounded-xl cursor-pointer transition-all duration-200
                  flex items-start justify-between gap-2
                  ${theme === 'dark'
                    ? 'hover:bg-[#111111]'
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate font-medium
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}
                  `}>
                    {chat.messages?.length > 0
                      ? chat.messages[0]?.content?.slice(0, 40) || 'New Chat'
                      : chat.name || 'New Chat'
                    }
                  </p>
                  <p className={`text-xs mt-1
                    ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}
                  `}>
                    {chat.messages?.length > 0
                      ? moment(chat.messages[0]?.timestamp).fromNow()
                      : 'No messages'
                    }
                  </p>
                </div>
                <button
                  onClick={(e) => deleteChat(e, chat._id)}
                  className={`
                    opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all
                    ${theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'}
                  `}
                  aria-label="Delete chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t border-inherit ${theme === 'dark' ? '' : ''}`}>
        {/* User Info */}
        {user && (
          <div className={`
            flex items-center gap-3 p-3 rounded-xl mb-3
            ${theme === 'dark' ? 'bg-[#111111]' : 'bg-gray-50'}
          `}>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <span className="text-emerald-600 font-bold text-sm">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate
                ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
              `}>
                {user.name || 'User'}
              </p>
              <p className={`text-xs
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
              `}>
                {user.credits} credits
              </p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="space-y-1">
          <button
            onClick={() => navigate('/credits')}
            className={`
              flex items-center gap-3 w-full p-3 rounded-xl transition-colors text-sm font-medium
              ${theme === 'dark' ? 'hover:bg-[#111111] text-gray-300' : 'hover:bg-gray-50 text-gray-700'}
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Buy Credits
          </button>

          <button
            onClick={() => navigate('/community')}
            className={`
              flex items-center gap-3 w-full p-3 rounded-xl transition-colors text-sm font-medium
              ${theme === 'dark' ? 'hover:bg-[#111111] text-gray-300' : 'hover:bg-gray-50 text-gray-700'}
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Community
          </button>

          <button
            onClick={logout}
            className={`
              flex items-center gap-3 w-full p-3 rounded-xl transition-colors text-sm font-medium
              ${theme === 'dark' ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-600'}
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
