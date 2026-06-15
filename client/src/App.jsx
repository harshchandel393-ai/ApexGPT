import React, { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Sidebar from './components/Sidebar'
import Credits from './pages/Credits'
import Community from './pages/Community'
import Login from './pages/Login'
import {assets} from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import { useAppContext } from './context/AppContext'

const App = () => {

  const { user, theme } = useAppContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {pathname} = useLocation()

  if(pathname === '/loading') return <Loading />

  return (
    <>
    {!isMenuOpen && 
    <img 
    src={assets.menu_icon} 
    className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert'
    onClick={()=>setIsMenuOpen(true)}
    />}

    {user ? (

    <div
  style={{
    background: theme === "dark"
      ? "linear-gradient(to bottom, #242124, #000000)"
      : "#f8f8f8",
    
  }}
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

    <div className='bg-white dark:bg-linear-to-b dark:from-[#242124] dark:to-[#000000]
    flex items-center justify-center h-screen w-screen'>

        <Login />

    </div>

  )}
      
    </>
  )
}

export default App