import React,{useEffect,useRef,useState} from 'react'
import {useAppContext} from '../context/AppContext'
import {assets} from '../assets/assets'
import Message from './Message'
import toast from 'react-hot-toast'



const ChatBox =()=>{


const containerRef = useRef(null)

const {selectedChat,theme, user, axios, token, setUser}=useAppContext()

const [messages,setMessages]=useState([])
const [loading,setLoading]=useState(false)

const [prompt,setPrompt]=useState('')
const [mode,setMode]=useState('text')
const [isPublished,setIsPublished]=useState(false)

const onSubmit = async (e) => {
  e.preventDefault()
  try {
    e.preventDefault()
    if(!user) return toast('Login to send message')
      setLoading(true)
      const promptCopy = prompt
      setPrompt('')
      setMessages(prev => [...prev, {role: 'user', content: prompt, timestamp: Date.now(), isImage: false}])

      const {data} = await axios.post(`/api/message/${mode}`, {chatId:
        selectedChat._id, prompt, isPublished}, {headers: { Authorization: token }})

        if(data.success){
          setMessages(prev => [...prev, data.reply])
          // decrease credits
          if (mode === 'image'){
            setUser(prev => ({...prev, credits: prev.credits - 2}))
          }else{
            setUser(prev => ({...prev, credits: prev.credits - 1}))
          }
        }else{
          toast.error(data.message)
          setPrompt(promptCopy)
        }
  } catch (error) {
    toast.error(error.message)
  }finally{
    setPrompt('')
    setLoading(false)
  }
}

useEffect(()=>{

if(selectedChat)
setMessages(selectedChat.messages)

},[selectedChat])

useEffect(()=>{
  if(containerRef.current){
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    })
  }
},[messages])



return (

<div className='flex-1 flex flex-col justify-between 
m-5 md:m-10 xl:mx-30 max-md:mt-14'>


<div ref={containerRef}
className='flex-1 overflow-y-scroll mb-5'>


{
messages.length===0 &&

<div className='h-full flex flex-col items-center justify-center gap-2'>


<img
src={theme==='dark'?assets.logo_full:assets.logo_full_dark}
className='w-full max-w-56'
alt=""
/>


<p
  style={{ color: "#9CA3AF" }}
  className='mt-5 text-6xl font-light text-center'
>

Ask me anything.

</p>


</div>

}



{
messages.map((message,index)=>

<Message key={index} message={message}/>

)

}

{loading && (
  <div className="flex gap-1 my-4">
    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:200ms]"></span>
    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:400ms]"></span>
  </div>
)}



</div>

{mode === "image" && (
  <div className="flex items-center justify-center gap-2 mb-4">
    <label
  className={`text-sm font-medium ${
    theme === "dark" ? "text-white" : "text-black"
  }`}
>
      Publish Generated Image to Community
    </label>

    <input
      type="checkbox"
      checked={isPublished}
      onChange={(e) => setIsPublished(e.target.checked)}
      className="w-4 h-4 cursor-pointer"
    />
  </div>
)}



<form
onSubmit={onSubmit}
className={`${
theme === 'dark'
? 'bg-[#1a1525] border-purple-900'
: 'bg-white border-gray-300'
}
border
shadow-sm
rounded-full
w-full max-w-4xl
h-16
px-5
mx-auto
flex items-center`}
>


<select
value={mode}
onChange={(e)=>setMode(e.target.value)}
className={`bg-transparent
outline-none
text-lg
font-medium
cursor-pointer
${theme==='dark' ? 'text-white' : 'text-gray-700'}`}
>

<option value="text">
Text
</option>

<option value="image">
Image
</option>


</select>



<input
value={prompt}
onChange={(e)=>setPrompt(e.target.value)}
placeholder="Type your prompt here..."
className={`flex-1 bg-transparent outline-none
text-base ml-4
${theme==='dark'
? 'text-white placeholder:text-gray-500'
: 'text-gray-700 placeholder:text-gray-400'
}`}
/>


<button
type="submit"
className='w-11 h-11 rounded-full
bg-gradient-to-r from-purple-500 to-purple-600
flex items-center justify-center'
>
  <img
    src={assets.send_icon}
    className='w-5'
    alt=""
  />
</button>




</form>



</div>


)

}

export default ChatBox