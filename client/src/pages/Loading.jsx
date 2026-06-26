import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const Loading = () => {

  const navigate = useNavigate()
  const { fetchUser } = useAppContext()

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/')
    }, 8000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className='bg-[#0a0a0a] flex items-center justify-center h-screen w-screen'>
      <div className='flex flex-col items-center gap-6'>
        {/* Logo */}
        <img
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cdefs%3E%3ClinearGradient id='nucleus' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2322c55e'/%3E%3Cstop offset='100%25' style='stop-color:%2316a34a'/%3E%3C/linearGradient%3E%3ClinearGradient id='orbit' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%234ade80;stop-opacity:0.6'/%3E%3Cstop offset='50%25' style='stop-color:%2322c55e;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%234ade80;stop-opacity:0.6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cellipse cx='20' cy='20' rx='16' ry='6' fill='none' stroke='url(%23orbit)' stroke-width='1' transform='rotate(-45 20 20)'/%3E%3Cellipse cx='20' cy='20' rx='16' ry='6' fill='none' stroke='url(%23orbit)' stroke-width='1' transform='rotate(45 20 20)'/%3E%3Cellipse cx='20' cy='20' rx='16' ry='6' fill='none' stroke='url(%23orbit)' stroke-width='1' transform='rotate(0 20 20)'/%3E%3Ccircle cx='32' cy='12' r='2.5' fill='%234ade80'/%3E%3Ccircle cx='8' cy='28' r='2.5' fill='%234ade80'/%3E%3Ccircle cx='28' cy='32' r='2.5' fill='%2322c55e'/%3E%3Ccircle cx='20' cy='20' r='8' fill='url(%23nucleus)'/%3E%3Ctext x='20' y='24' font-family='Arial' font-size='10' font-weight='bold' fill='white' text-anchor='middle'%3EA%3C/text%3E%3C/svg%3E"
          alt="ApexGPT"
          className='w-16 h-16 animate-pulse'
        />

        {/* Spinner */}
        <div className='w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin'></div>

        {/* Text */}
        <p className='text-gray-400 text-sm'>Loading ApexGPT...</p>
      </div>
    </div>
  )
}

export default Loading
