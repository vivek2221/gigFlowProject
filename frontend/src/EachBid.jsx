import { useNavigate, useOutletContext } from 'react-router-dom'

function EachBid({freelancerId,gigId,status,setVis,message,price,bidId,title}) {
  const navigate=useNavigate()
  const {soc}=useOutletContext()
  return (
    <div className="eachBids">
          <div>{message}</div>
          <div>{price}$</div>
          <button onClick={(e)=>{
            if(status==='hired'){
              return 
            }
            fetch(`${import.meta.env.VITE_URL_SERVER}/api/gigs/statusChange`,{
              method:'POST',
              credentials:'include',
              headers:{
                'content-type':'application/json'
              }
              ,
              body:JSON.stringify({gigId,freelancerId})
            }).then(data=>data.json())
            .then(data=>{
              if(data.mess && data.mess==='reLogin'){
                navigate('/')
              }
              if(data.mess && data.mess==='updated'){
                if(!soc.connected){
              soc.connect()
            }
            soc.emit('chatMessage',{
              to:freelancerId,
              message:`you have been hired for ${title}!`
            })
              }
            })
            setVis('none')}
          }>{status}</button>
        </div>
  )
}

export default EachBid