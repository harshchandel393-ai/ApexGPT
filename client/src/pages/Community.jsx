import React, { useEffect, useState } from 'react'
import { dummyPublishedImages } from '../assets/assets'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Community = () => {

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const { axios, theme } = useAppContext()

  const fetchImages = async () => {
    try {
      const { data } = await axios.get('/api/user/published-images')
      if (data.success) {
        setImages(data.images)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchImages()
  }, [])

  if (loading) return <Loading />

  return (
    <div className={`min-h-screen overflow-y-auto ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 px-6 py-4 border-b
        ${theme === 'dark' ? 'bg-[#0a0a0a] border-gray-800' : 'bg-white border-gray-200'}
      `}>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Community Gallery
        </h1>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Explore AI-generated images from the community
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((item, index) => (
              <a
                key={index}
                href={item.imageUrl}
                target='_blank'
                rel="noopener noreferrer"
                className={`
                  group relative block rounded-2xl overflow-hidden border transition-all duration-300
                  ${theme === 'dark'
                    ? 'border-gray-800 hover:border-emerald-500/50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                  hover:shadow-xl
                `}
              >
                <img
                  src={item.imageUrl}
                  alt="Community image"
                  className='w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300'
                  loading="lazy"
                />
                <div className={`
                  absolute bottom-0 left-0 right-0 p-4
                  bg-gradient-to-t from-black/80 to-transparent
                `}>
                  <p className='text-white text-sm font-medium'>
                    by {item.userName || 'Anonymous'}
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center py-20
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
          `}>
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">No images available yet</p>
            <p className="text-sm mt-1">Be the first to share an image with the community!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Community
