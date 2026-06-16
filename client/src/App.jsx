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
      <Toaster />

      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert'
          onClick={() => setIsMenuOpen(true)}
          alt=""
        />
      )}

      {user ? (

        <div
          className={`h-screen w-screen ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-[#1c1529] via-[#0f0b18] to-black'
              : 'bg-[#f8f8f8]'
          }`}
        >
          <div className='flex h-screen w-screen'>

            <Sidebar
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />

            <Routes>
              <Route path='/' element={<ChatBox />} />
              <Route path='/credits' element={<Credits />} />
              <Route path='/community' element={<Community />} />
            </Routes>

          </div>
        </div>

      ) : (

        <div
          className={`flex items-center justify-center h-screen w-screen ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-[#1c1529] via-[#0f0b18] to-black'
              : 'bg-white'
          }`}
        >
          <Login />
        </div>

      )}
    </>
  )
}

export default App