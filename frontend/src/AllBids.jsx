import { useEffect, useState } from "react"
import EachBid from "./EachBid.jsx"
import { useNavigate } from "react-router-dom"

function AllBids({gigId,setVis,vis}) {
  const navigate=useNavigate()
  const [content,setContent]=useState([])
   useEffect(()=>{
    if(gigId!=''){
     fetch(`${import.meta.env.VITE_URL_SERVER}/api/bids/${gigId}`,
      {
        method:'GET',
        credentials:'include',
      }
     ).then(data=>data.json())
     .then((data)=>{
      let arr=[]
      if(data.mess && data.mess==='reLogin'){
        navigate('/')
      }
      if(data ){
        data.forEach((ele)=>{
        arr.push(ele)
        })
        setContent(arr)
      }
     })
    }
   },[gigId,vis])
  return (
    <div className="bidsContainer" style={{display:vis}} onClick={(e)=>{
        e.stopPropagation()
      }}>
        {content.map((ele,index)=>{
          return <EachBid title={ele.title} freelancerId={ele.freelancerId} bidId={ele._id} setVis={setVis} gigId={gigId} message={ele.message} price={ele.price} key={index} status={ele.status}/>
        })}
      </div>
  )
}

export default AllBids