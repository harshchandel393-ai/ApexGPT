import React, { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Sidebar from './components/Sidebar'
import Credits from './pages/Credits'
import Community from './pages/Community'
import Login from './pages/Login'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import { useAppContext } from './context/AppContext'
import { Toaster } from 'react-hot-toast'

const App = () => {

  const { user, loadingUser, theme } = useAppContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  if (pathname === '/loading' || loadingUser) {
    return <Loading />
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
            color: theme === 'dark' ? '#f8fafc' : '#0f172a',
            border: theme === 'dark' ? '1px solid #262626' : '1px solid #e2e8f0',
          },
        }}
      />

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg transition-all duration-300
          md:hidden
          ${theme === 'dark'
            ? 'bg-[#1a1a1a] hover:bg-[#262626] text-white'
            : 'bg-white hover:bg-gray-100 text-gray-900 shadow-md'
          }
          ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {user ? (
        <div
          className={`h-screen w-screen flex overflow-hidden
            ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]'}
          `}
        >
          <Sidebar
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />

          <main className="flex-1 flex flex-col h-full overflow-hidden">
            <Routes>
              <Route path='/' element={<ChatBox />} />
              <Route path='/credits' element={<Credits />} />
              <Route path='/community' element={<Community />} />
            </Routes>
          </main>
        </div>
      ) : (
        <div
          className={`flex items-center justify-center h-screen w-screen
            ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]'}
          `}
        >
          <Login />
        </div>
      )}
    </>
  )
}

export default App
