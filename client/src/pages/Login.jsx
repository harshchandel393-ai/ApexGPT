import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';   // <-- Add this
import toast from "react-hot-toast";
const Login = () => {

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { axios, setToken, theme } = useAppContext()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = state === "login" ? '/api/user/login' : '/api/user/register'
    try {
      const { data } = await axios.post(url, { name, email, password })
      if (data.success) {
        setToken(data.token)
        localStorage.setItem('token', data.token)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4
      ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]'}
    `}>
      <form
        onSubmit={handleSubmit}
        className={`
          flex flex-col gap-5 w-full max-w-sm p-8 rounded-2xl shadow-2xl border
          ${theme === 'dark'
            ? 'bg-[#111111] border-gray-800 text-white'
            : 'bg-white border-gray-200 text-gray-900'
          }
        `}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <img
            src={assets.logo}
            alt="ApexGPT"
            className="w-16 h-16"
          />
          <h1 className="text-2xl font-bold">ApexGPT</h1>
        </div>

        <p className={`text-center text-sm
          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
        `}>
          {state === "login" ? "Welcome back!" : "Create your account"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <label className="block text-sm font-medium mb-1.5">Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="John Doe"
              className={`
                w-full p-3 rounded-xl border text-sm outline-none transition-colors
                ${theme === 'dark'
                  ? 'bg-[#0a0a0a] border-gray-700 text-white focus:border-emerald-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400'
                }
              `}
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full">
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="you@example.com"
            className={`
              w-full p-3 rounded-xl border text-sm outline-none transition-colors
              ${theme === 'dark'
                ? 'bg-[#0a0a0a] border-gray-700 text-white focus:border-emerald-500'
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400'
              }
            `}
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium mb-1.5">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="••••••••"
            className={`
              w-full p-3 rounded-xl border text-sm outline-none transition-colors
              ${theme === 'dark'
                ? 'bg-[#0a0a0a] border-gray-700 text-white focus:border-emerald-500'
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400'
              }
            `}
            type="password"
            required
          />
        </div>

        <p className={`text-center text-sm
          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
        `}>
          {state === "register" ? (
            <>
              Already have an account?{' '}
              <span
                onClick={() => setState("login")}
                className="text-emerald-500 hover:text-emerald-400 cursor-pointer font-medium"
              >
                Login
              </span>
            </>
          ) : (
            <>
              Create an account?{' '}
              <span
                onClick={() => setState("register")}
                className="text-emerald-500 hover:text-emerald-400 cursor-pointer font-medium"
              >
                Sign up
              </span>
            </>
          )}
        </p>

        <button
          type="submit"
          className="
            w-full py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-emerald-600 to-teal-600
            hover:from-emerald-500 hover:to-teal-500
            shadow-lg shadow-emerald-500/20
            transition-all duration-200
            active:scale-[0.98]
          "
        >
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  )
}

export default Login
