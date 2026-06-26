import React, { useEffect, useState } from 'react'
import { dummyPlans } from '../assets/assets'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import toast from "react-hot-toast";

const Credits = () => {

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const { token, axios } = useAppContext()
  const { theme } = useAppContext()

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get('/api/credit/plan', {
        headers: { Authorization: token }
      })
      if (data.success) {
        setPlans(data.plans)
      } else {
        toast.error(data.message || 'Failed to fetch plans.')
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const purchasePlan = async (planId) => {
    try {
      const { data } = await axios.post('/api/credit/purchase', { planId },
        { headers: { Authorization: token } }
      )
      if (data.success) {
        window.location.href = data.url
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  if (loading) return <Loading />

  return (
    <div className={`min-h-screen overflow-y-auto ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 px-6 py-4 border-b
        ${theme === 'dark' ? 'bg-[#0a0a0a] border-gray-800' : 'bg-white border-gray-200'}
      `}>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Credit Plans
        </h1>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className={`text-center mb-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Choose a plan that fits your needs. More credits = more possibilities.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`
                rounded-2xl border p-6 flex flex-col transition-all duration-300
                ${plan._id === 'pro'
                  ? theme === 'dark'
                    ? 'bg-gradient-to-b from-emerald-900/30 to-[#0a0a0a] border-emerald-600 shadow-lg shadow-emerald-500/10'
                    : 'bg-gradient-to-b from-emerald-50 to-white border-emerald-200 shadow-lg'
                  : theme === 'dark'
                    ? 'bg-[#111111] border-gray-800 hover:border-gray-700'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex-1">
                {/* Plan Name */}
                <h3 className={`text-xl font-bold mb-2
                  ${plan._id === 'pro'
                    ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                    : theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }
                `}>
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <span className={`text-4xl font-bold
                    ${plan._id === 'pro'
                      ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                      : theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }
                  `}>
                    ${plan.price}
                  </span>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    {' '}/ {plan.credits} credits
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className={`text-sm flex items-center gap-2
                      ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
                    `}>
                      <svg className={`w-4 h-4 shrink-0 ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => purchasePlan(plan._id)}
                className={`
                  w-full py-3 rounded-xl font-semibold transition-all duration-200
                  ${plan._id === 'pro'
                    ? theme === 'dark'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }
                `}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Credits
