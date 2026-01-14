
import { useEffect, useState } from "react"
import SingleGig from "./SingleGig"
import { useNavigate, useOutletContext } from "react-router-dom"
import AllBids from "./AllBids"


function Mygigs() {
  const navigate=useNavigate()
  const {messages}=useOutletContext()
    const [gigId,setgigId]=useState('')
  const [vis,setVis]=useState('none')
  const [content,setContent]=useState(['no curr gigs'])
  useEffect(()=>{
    fetch(`${import.meta.env.VITE_URL_SERVER}/api/gigs/myGigs`,{
      method:'GET',
      credentials:'include'
    })
    .then(data=>data.json())
    .then((data)=>{
      if(data.mess && data.mess==='reLogin'){
        navigate('/')
      }
      let arr=[]
      if(data){
      data.forEach((ele)=>{
        arr.push(ele)
      })
      setContent(arr)}
    })
  },[messages])
  return (
    <div className="outerMainDivOfMyGigs" onClick={(e)=>{
      if(vis!=='none'){
        setVis('none')
      }
    }}>
      {content?content.map((ele,index)=>{
        return <SingleGig setgigId={setgigId} setVis={setVis} vis={vis} buttonContent={'view bids'} description={ele.description} id={ele.ownerId} gigId={ele._id} price={ele.budget} title={ele.title} key={index}/>
      }):'no curr content'}
      <AllBids content={content} gigId={gigId} setVis={setVis} vis={vis}/>
    </div>
  )
}

export default Mygigs