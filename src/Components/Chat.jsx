
import { useEffect, useRef, useState } from 'react'
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
    const socketRef = useRef(null)

    useEffect(()=>{
        let isActive = true
        axios.get(BASE_URL+"/chat/"+targetUserid,{withCredentials:true })
            .then((chat) => {
                const chatMessages = chat?.data?.messages?.map((msg) => {
                    const {senderId,text} = msg
                    return {
                        firstName: senderId?.firstName,
                        lastName: senderId?.lastName,
                        text,
                    }
                })
                if (!Array.isArray(chatMessages)) {
                    throw new Error("Chat response did not contain a message list")
                }
                if (isActive) setMessages(chatMessages)
            })
            .catch((err) => {
                console.error("Unable to load chat messages", err)
            })
        return () => {
            isActive = false
        }
    },[targetUserid])

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
        socketRef.current = socket
        

        return ()=>{
            socket.off("messageRecieved")
            socket.disconnect();
            socketRef.current = null;
        }
    },[userId,user?.firstName,targetUserid])

    const sendMessage = ()=>{
      const socket = socketRef.current
      if (!socket || !user) return

      socket.emit("sendMessage",{firstName:user.firstName,lastName:user.lastName, userId,targetUserid,text:newMessage});
      setNewMessage("")

    }

    const otherParticipant = messages.find((message) => message.firstName !== user?.firstName)
    const participantName = otherParticipant
        ? `${otherParticipant.firstName} ${otherParticipant.lastName}`.trim()
        : "Your connection"
    const participantInitials = participantName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => name[0])
        .join("")

    return (
        <main className="chat-page network-page px-4 py-8 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-4xl">
                <header className="chat-page-heading mb-6 text-center sm:mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Your network</p>
                    <h1 className="mt-2 text-3xl font-bold">Messages</h1>
                    <p className="mt-2 text-base-content/65">A little more connection, one message at a time.</p>
                </header>

                <section className="chat-panel" aria-label={`Chat with ${participantName}`}>
                    <header className="chat-panel-header">
                        <div className="chat-participant-avatar" aria-hidden="true">{participantInitials}</div>
                        <div className="min-w-0">
                            <p className="chat-panel-eyebrow">Conversation</p>
                            <h2 className="chat-participant-name">{participantName}</h2>
                        </div>
                        <div className="chat-secure-note">
                            <span className="chat-secure-dot" aria-hidden="true"></span>
                            <span>1:1 chat</span>
                        </div>
                    </header>

                    <div className="chat-thread" aria-live="polite">
                        {messages.length === 0 ? (
                            <div className="chat-empty-state">
                                <div className="chat-empty-mark" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5c-1.2 0-2.34-.28-3.35-.79L4 20l1.79-4.15A7.47 7.47 0 0 1 4.5 11.5 7.5 7.5 0 0 1 12 4h.5a7.5 7.5 0 0 1 7.5 7.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <h3>Start the conversation</h3>
                                <p>Your messages will feel right at home here.</p>
                            </div>
                        ) : (
                            <div className="chat-message-list">
                                {messages.map((msg, index) => {
                                    const isCurrentUser = user?.firstName === msg.firstName
                                    return (
                                        <div key={index} className={`chat-message-row ${isCurrentUser ? "is-outgoing" : "is-incoming"}`}>
                                            {!isCurrentUser && (
                                                <div className="chat-message-avatar" aria-hidden="true">
                                                    {`${msg.firstName?.[0] || ""}${msg.lastName?.[0] || ""}`}
                                                </div>
                                            )}
                                            <div className="chat-message-content">
                                                {!isCurrentUser && <p className="chat-message-sender">{msg.firstName} {msg.lastName}</p>}
                                                <div className="chat-message-bubble">{msg.text}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <div className="chat-composer">
                        <label className="sr-only" htmlFor="chat-message">Write a message</label>
                        <input
                            id="chat-message"
                            type="text"
                            value={newMessage}
                            onChange={(e)=>{
                                setNewMessage(e.target.value)
                            }}
                            placeholder="Write a message..."
                            className="chat-message-input"
                        />
                        <button type="button" className="chat-send-button" onClick={sendMessage} aria-label="Send message">
                            <span>Send</span>
                            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                <path d="m3 10 14-7-4.5 14-2.7-5.8L3 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="m9.8 11.2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Chat
