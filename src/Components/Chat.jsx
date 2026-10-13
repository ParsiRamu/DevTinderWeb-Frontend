
import React, { useEffect,useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'

const Chat = () => {
    const {targetUserid} = useParams()
    const user = useSelector((store)=>store.user)
    const userId = user?._id
    const [newMessage,setNewMessage] = useState("")
    const [messages,setMessages] = useState([])
    // const socketRef = useRef(null);

    const fetchChatMessage = async()=>{
        const chat = await axios.get(BASE_URL+"/chat/"+targetUserid,{withCredentials:true });

        console.log(chat.data.messages)

        const  chatMessages = chat?.data?.messages.map((msg)=>{
            const {senderId,text} = msg;
            return {
                firstName: senderId?.firstName,
                lastName:senderId?.lastName,
                text,
            }
        })
        setMessages(chatMessages)

    }

    useEffect(()=>{
        fetchChatMessage();
    },[])

    useEffect(()=>{
        if(!userId){
            return;
        }
        const socket = createSocketConnection();
        //As soon as Page loads the Socket connection is created and jointChat  event is emitted
        socket.emit("joinChat",{firstName:user.firstName,userId,targetUserid});

        socket.on("messageRecieved",({firstName,lastName,text})=>{
            console.log(firstName+" : "+text)
            setMessages((prevMessages)=>[...prevMessages,{firstName,lastName,text}])
        })
        

        return ()=>{
            socket.off("message Recieved")
            socket.disconnect();
            socketRef.current = null;
        }
    },[userId,targetUserid])

    const sendMessage = ()=>{
        const socket = createSocketConnection()
    //      const text = newMessage.trim();

    // if (!text || !socketRef.current) return;

      socket.emit("sendMessage",{firstName:user.firstName,lastName:user.lastName, userId,targetUserid,text:newMessage});
      setNewMessage("")

    }




  return (
    <div className='w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col'>
    <h1 className='p-5 border-b border-gray-600'>Chat</h1>
    <div className='flex-1 overflow-scroll p-5'>{
        messages.map((msg,index)=>{
            return (
            <div key={index} className={`chat ${user.firstName === msg.firstName ? "chat-end": "chat-start"}`}>
               <div className="chat-header">
              {msg.firstName +" "+ msg.lastName}
                 <time className="text-xs opacity-50">2 hours ago</time>
                    </div>
                 <div className="chat-bubble">{msg.text}</div>
                  <div className="chat-footer opacity-50">Seen</div>
             </div>
            )
        })}</div>
    <div className='p-5 border-t border-gray-600 flex items-center gap-2'>
        <input 
        value={newMessage}
        onChange={(e)=>{
            setNewMessage(e.target.value)
        }}
        className='flex-1 border border-gray-500 text-black rounded p-2'></input>
        <button className="btn btn-secondary" onClick={sendMessage}>Send</button>
    </div>
    </div>
  )
}

export default Chat
