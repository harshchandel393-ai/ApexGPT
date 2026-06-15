import React,{useEffect,useRef,useState} from 'react'
import {useAppContext} from '../context/AppContext'
import {assets} from '../assets/assets'
import Message from './Message'


const ChatBox =()=>{


const containerRef = useRef(null)

const {selectedChat,theme}=useAppContext()

const [messages,setMessages]=useState([])
const [loading,setLoading]=useState(false)

const [prompt,setPrompt]=useState('')
const [mode,setMode]=useState('text')
const [isPublished,setIsPublished]=useState(false)



useEffect(()=>{

if(selectedChat)
setMessages(selectedChat.messages)

},[selectedChat])



return (

<div className='flex-1 flex flex-col justify-between 
m-5 md:m-10 xl:mx-30 max-md:mt-14
bg-[#fafafa] dark:bg-transparent'>


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



</div>



<form
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