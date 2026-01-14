import { useEffect, useState } from 'react'
import SingleGig from './SingleGig.jsx'
import { useNavigate, useOutletContext } from 'react-router-dom'
import PopUpForBiding from './PopUpForBiding.jsx'

function AllGigs() {
  const navigate=useNavigate()
  const {messages}=useOutletContext()
  const [inputVal,setInputVal]=useState('')
  const [idForPopUp,setIdForPopUp]=useState({id:'',display:'none',top:0,left:0})
  const [content,setContent]=useState(['no curr gigs'])
  useEffect(()=>{
    fetch(`${import.meta.env.VITE_URL_SERVER}/api/gigs`,{
      method:'GET',
      credentials:'include'
    }).then(data=>data.json())
    .then((data)=>{
      if(data.mess && data.mess==='reLogin'){
         navigate('/')
      }
      let arr=[]
      data.dataAll.forEach((ele)=>{
       arr.push(ele)
      })
      setContent(arr)
    })
  },[messages])
  return (
    <div id="allGigsContentHolder" onClick={(e)=>{
      if(idForPopUp.display!=='none'){
        setIdForPopUp(prev=>({...prev,id:'',display:'none',top:0,left:0}))
      }
    }}>
      <div className='searchsection'><input placeholder='Search here ...' value={inputVal} onChange={(e)=>{
        setInputVal(e.target.value)
      }}></input></div>
      <div className='allGigs'>
      {content?content
          .filter((ele) => {
            if (inputVal === "") return true;
            return ele.title?.toLowerCase().includes(inputVal.toLowerCase());
          }).map((ele,index)=>{
        return <SingleGig status={ele.status} Id={idForPopUp} setId={setIdForPopUp} buttonContent={'apply'} price={ele.budget} title={ele.title} description={ele.description} id={ele.ownerId} IdUsedForBiding={ele._id} key={index}/>
       }):'no current gigs'}
        <PopUpForBiding idForPopUp={idForPopUp} setIdForPopUp={setIdForPopUp}/>
      </div>
    </div>
  )
}

export default AllGigs