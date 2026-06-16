import React, { useEffect, useState } from 'react'
import { dummyPlans } from '../assets/assets'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import { toast } from "react-toastify";
const Credits = () => {

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const {token, axios } = useAppContext()

  const { theme } = useAppContext()

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get('/api/credit/plan', {
        headers: { Authorization: token }
      })
      if (data.success){
        setPlans(data.plans)
      }else{
        toast.error(data.message || 'Failed to fetch plans.')
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

     const purchasePlan = async (planId) => {
      try {
        const { data } = await axios.post('/api/credit/purchase', {planId},
          {headers: { Authorization: token }}
        )
        if (data.success) {
          window.location.href = data.url
        }else{
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
    <div className="max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 pt-16">

      <h2
        className={`text-5xl font-bold text-center mb-14 ${
          theme === 'dark' ? 'text-white' : 'text-black'
        }`}
      >
        Credit Plans
      </h2>

      <div className="flex flex-wrap justify-center items-start gap-8">

        {plans.map((plan) => (

          <div
            key={plan._id}
            className={`rounded-2xl border transition-all duration-300 p-7 min-w-[320px] flex flex-col ${
              plan._id === 'pro'
                ? theme === 'dark'
                  ? 'bg-[#6B2BBF] border-[#6B2BBF] text-white'
                  : 'bg-purple-50 border-purple-200 text-gray-900'
                : theme === 'dark'
                  ? 'bg-black/40 border-purple-700 text-white'
                  : 'bg-white border-gray-200 text-gray-900 shadow-sm'
            }`}
          >

            <div className="flex-1">

              <h3
                className={`text-2xl font-semibold mb-5 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {plan.name}
              </h3>

              <p className="text-4xl font-bold text-[#D8B4FE] mb-7">
                ${plan.price}

                <span
                  className={`text-lg font-normal ${
                    theme === 'dark'
                      ? 'text-purple-100'
                      : 'text-gray-600'
                  }`}
                >
                  {' '} / {plan.credits} credits
                </span>
              </p>

              <ul
                className={`space-y-4 ${
                  theme === 'dark'
                    ? 'text-gray-200'
                    : 'text-gray-700'
                }`}
              >
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span>•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

            </div>

            <button onClick={()=> toast.promise(purchasePlan(plan._id), {loading: 'Processing...'
            })}
              className="mt-8 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-medium cursor-pointer hover:opacity-90"
            >
              Buy Now
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Credits