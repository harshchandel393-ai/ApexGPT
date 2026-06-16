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
      if(!confirm) return
      const { data } = await axios.post('/api/chat/delete', {chatId}, {
      headers: { Authorization: token}  
      })
      if(data.success){
        setChats(prev => prev.filter(chat => chat._id !== chatId))
        await fetchUserChats()
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      
    }
  }

  return (
    <div
      className={`flex flex-col h-screen min-w-72 p-5
      ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-[#242124] to-black text-white'
          : 'bg-white text-black'
      }
      border-r
      ${
        theme === 'dark'
          ? 'border-[#80609F]/30'
          : 'border-gray-200'
      }
      transition-all duration-500
      max-md:absolute left-0 z-10
      ${!isMenuOpen ? 'max-md:-translate-x-full' : ''}
      `}
    >

      {/* Logo */}

      <img
        src={theme === 'dark'
          ? assets.logo_full
          : assets.logo_full_dark}
        className="w-full max-w-48"
        alt=""
      />

      {/* New Chat */}

      <button
        onClick={createNewChat}
        className="flex justify-center items-center w-full py-3 mt-8
        text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6]
        rounded-xl shadow-md text-sm font-medium cursor-pointer"
      >
        <span className="mr-2 text-xl">+</span>
        New Chat
      </button>

      {/* Search */}

      <div
        className={`flex items-center gap-2 p-3 mt-5
        border rounded-xl shadow-sm
        ${
          theme === 'dark'
            ? 'border-[#80609F]/30 bg-[#1b1b1b]'
            : 'border-gray-200 bg-white'
        }`}
      >
        <span className="text-lg">🔍</span>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations"
          className={`w-full bg-transparent outline-none text-sm
          ${
            theme === 'dark'
              ? 'text-white placeholder:text-gray-400'
              : 'text-black placeholder:text-gray-400'
          }`}
        />
      </div>

      {/* Recent Chats */}

      {chats?.length > 0 && (
        <p className="mt-5 text-sm font-medium">
          Recent Chats
        </p>
      )}

      <div className="flex-1 overflow-y-auto mt-3 space-y-3">

        {(chats || [])
          .filter((chat) =>
            chat.messages?.[0]
              ? chat.messages[0]?.content
                  ?.toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name
                  ?.toLowerCase()
                  .includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                navigate('/')
                setSelectedChat(chat)
                setIsMenuOpen(false)
              }}
              className={`p-3 rounded-xl border shadow-sm
              cursor-pointer flex justify-between group
              ${
                theme === 'dark'
                  ? 'border-[#80609F]/20 bg-[#1a1a1a]'
                  : 'border-gray-200 bg-white'
              }`}
            >

              <div className="overflow-hidden">

                <p className="truncate text-sm">
                  {
                    chat.messages?.length > 0
                      ? chat.messages[0]?.content?.slice(0, 32)
                      : chat.name
                  }
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {moment(chat.updatedAt).fromNow()}
                </p>

              </div>

              <img
                src={assets.bin_icon}
                alt=""
                className="hidden group-hover:block w-4 h-4 dark:invert"
                onClick={e=> toast.promise(deleteChat(e, chat._id), {loading:
                  'deleting...'
                })}
              />

            </div>
          ))}
      </div>

      {/* Community Images */}

      <div
        onClick={() => {
          navigate('/community')
          setIsMenuOpen(false)
        }}
        className={`flex items-center gap-3 px-4 py-3 mt-3
        rounded-lg cursor-pointer
        ${
          theme === 'dark'
            ? 'hover:bg-white/10'
            : 'hover:bg-gray-100'
        }`}
      >
        <span className="text-lg">🖼️</span>
        <p className="text-sm">Community Images</p>
      </div>

      {/* Credits */}

      <div
        onClick={() => {
          navigate('/credits')
          setIsMenuOpen(false)
        }}
        className={`flex items-center gap-3 px-4 py-3 mt-2
        rounded-lg cursor-pointer
        ${
          theme === 'dark'
            ? 'hover:bg-white/10'
            : 'hover:bg-gray-100'
        }`}
      >
        <span className="text-lg">💎</span>

        <div>
          <p className="text-sm">
            Credits : {user?.credits}
          </p>

          <p className="text-xs text-gray-500">
            Purchase credits to use quickgpt
          </p>
        </div>
      </div>

      {/* Dark Mode */}

      <div
        className={`flex items-center justify-between
        px-4 py-3 mt-2 rounded-lg
        ${
          theme === 'dark'
            ? 'hover:bg-white/10'
            : 'hover:bg-gray-100'
        }`}
      >

        <div className="flex items-center gap-2">
          <span className="text-lg">☀️</span>
          <p className="text-sm">Dark Mode</p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">

          <input
            type="checkbox"
            className="sr-only peer"
            checked={theme === 'dark'}
            onChange={() =>
              setTheme(
                theme === 'dark'
                  ? 'light'
                  : 'dark'
              )
            }
          />

          <div
            className="w-10 h-5 bg-gray-400 rounded-full
            peer-checked:bg-purple-600"
          >
            <span
              className="absolute left-1 top-1
              w-3 h-3 bg-white rounded-full
              transition-transform
              peer-checked:translate-x-5"
            />
          </div>

        </label>

      </div>

      {/* User */}

      <div
        className={`flex items-center gap-3 px-4 py-3 mt-3
        rounded-lg cursor-pointer group
        ${
          theme === 'dark'
            ? 'hover:bg-white/10'
            : 'hover:bg-gray-100'
        }`}
      >
        <img
          src={assets.user_icon}
          alt=""
          className="w-8 h-8 rounded-full"
        />

        <p className="flex-1 text-sm truncate">
          {user ? user.name : 'Login your account'}
        </p>

        {user && (
          <img onClick={logout}
            src={assets.logout_icon}
            alt=""
            className="hidden group-hover:block h-5 dark:invert"
          />
        )}
      </div>

      {/* Mobile Close */}

      <img
        src={assets.close_icon}
        alt=""
        onClick={() => setIsMenuOpen(false)}
        className="absolute top-3 right-3 w-5
        cursor-pointer md:hidden dark:invert"
      />

    </div>
  )
}

export default Sidebar