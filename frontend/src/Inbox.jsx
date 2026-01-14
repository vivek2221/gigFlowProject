import MessagesInBox from "./MessagesInBox"


function Inbox({setCurrNotify,setVis,vis,messages}) {
  return (
    <div id="inbox" style={{display:vis}} onClick={(e)=>{
      e.stopPropagation()
      setCurrNotify('none')
    }}>
      {messages?messages.map((ele,index)=>{
        return <MessagesInBox mess={ele.message} key={index}/>
      }) : 'no message'}
    </div>
  )
}

export default Inbox