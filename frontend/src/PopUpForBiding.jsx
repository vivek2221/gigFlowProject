import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function PopUpForBiding({idForPopUp,setIdForPopUp}) {
    const validations={message:[{required:true,message:'message is required'}],price:[{required:true,message:'price is required'},{min:1,message:'price cannot be less than 1$'}]}
      const [values,setvalues]=useState({message:'',price:0})
      const navigate=useNavigate()
      const [errors,setErrors]=useState({})
      const checkValidation=(val)=>{
            let err={}
            val.forEach((keys)=>{
                if (!validations[keys]) return
                validations[keys].some((ele)=>{
                    if(ele.required && String(values[keys]).trim()===''){
                        err[keys]=ele.message
                        return true
                    }
                    if(ele.min && values[keys]<ele.min){
                        err[keys]=ele.message
                        return true
                    }
                })
            })
             return err
          }
  return (
     <div id='popUpForBiding' style={{display:idForPopUp.display,top:idForPopUp.top,left:idForPopUp.left}} onClick={(e)=>{
        if(idForPopUp.display!=='none'){
            e.stopPropagation()
        }
     }}>
        <div><u>biding</u></div>
    <div>message:<input value={values.message} onChange={(e)=>{
          setvalues(prev=>({...prev,message:e.target.value}))
        }}></input><p>{errors.message}</p></div>
        <div>price:<input type='number' value={values.price} onChange={(e)=>{
          setvalues(prev=>({...prev,price:e.target.value}))
        }}></input><p>{errors.price}</p></div>
        <div><button
        onClick={(e)=>{
         const errs= checkValidation(['message','price'])
         setErrors(errs)
         if(Object.keys(errs).length > 0) return 
          fetch(`${import.meta.env.VITE_URL_SERVER}/api/bids`,{
                method:'POST',
                credentials:'include',
                headers:{
                    'content-type':'application/json'
                },
                body:JSON.stringify({...values,gigId:idForPopUp.Id,status:'pending'})
                
             }).then(data=>data.json())
             .then(data=>{
                if(data.mess==='reLogin'){
                navigate('/')
                }
                
             })
            setvalues({message:'',price:''})
         setIdForPopUp(prev=>({...prev,id:'',display:'none',top:0,left:0}))
        }}
        >submit</button></div>
    </div>
  )
}

export default PopUpForBiding