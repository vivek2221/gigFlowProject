import { Outlet, useNavigate } from "react-router-dom"
import Inbox from './Inbox.jsx'
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

function Content({setVis,vis,currNotify,setCurrNotify}) {
  const navigate=useNavigate()
  const [messages,setMessages]=useState([])
  const [soc,setSoc]=useState(null)
  useEffect(()=>{
    const socket=io(import.meta.env.VITE_URL_SOCKET,{  
      reconnection: true,            
      timeout:60000,
  reconnectionAttempts: 10,     
  reconnectionDelay: 1000,       
  reconnectionDelayMax: 5000,  
  withCredentials: true,
  transports: [ "websocket"]
    })
    socket.on('message',(msg)=>{
      setMessages(prev=>([...prev,msg]))
      setCurrNotify('flex')
    })
    setSoc(socket)
    fetch(`${import.meta.env.VITE_URL_SERVER}/api/messages`,{
      method:"GET",
      credentials:'include'
    }).then(data=>data.json())
    .then(data=>{
      if(data.mess && data.mess==='reLogin'){
        navigate('/')
      }
      let arr=[]
      data.forEach((ele)=>{
        arr.push(ele)
      })
      setMessages(prev=>([...prev,...arr]))
    })
    return () => {
    socket.off("message")
    socket.disconnect()
  }
  },[])
  return (
    <div id="content">
        <Outlet context={{soc,messages}}/>
        <div id="showMessages"  onClick={(e)=>{
          setVis('flex')
          setCurrNotify('none')
        }}><i className="ri-inbox-archive-line"></i>
        <div id="messageIndicator"  style={{display:currNotify}}></div>
        </div>
        <Inbox setCurrNotify={setCurrNotify} messages={messages} setVis={setVis} vis={vis}/>
        </div>
  )
}

export default Content