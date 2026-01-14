import  { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateNewGig() {
  const validations={title:[{required:true,message:'title is required'}],description:[{required:true,message:'description is required'}],price:[{required:true,message:'price is required'},{min:1,message:'price should be greater than 1$'}]}
  const navigate=useNavigate()
  const [values,setValues]=useState({title:'',description:'',price:undefined})
  const [errors,setErrors]=useState({})
  const checkValidation=(val,values)=>{
        let err={}
        val.forEach((keys)=>{
            if (!validations[keys]) return
            validations[keys].some((ele)=>{
                if(ele.required && String(values[keys]).trim()===''){
                    err[keys]=ele.message
                    return true
                }
                if(ele.minLength && values[keys].length<ele.minLength){
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
    <div className='createNewGig'>
      <form className='formforGigs'>
        <div>Create New Gig</div>
        <br></br>
        <div><input placeholder='title' className='inputCreateGig' value={values.title} onChange={(e)=>{
          e.preventDefault()
          setValues(prev=>({...prev,title:e.target.value}))
        }}></input>
        <p>{errors.title}</p>
        <br></br>
        </div>
        <div><input placeholder='decription' className='inputCreateGig' value={values.description} onChange={(e)=>{
          e.preventDefault()
          setValues(prev=>({...prev,description:e.target.value}))
        }}></input>
        <p>{errors.description}</p>
        <br></br>
        </div>
        <div><input placeholder='budget' className='inputCreateGig' type='number'  value={values.price} onChange={(e)=>{
          e.preventDefault()
          setValues(prev=>({...prev,price:e.target.value}))
        }}></input>
        <p>{errors.price}</p>
        <br></br>
        </div>
        <div>
        <button className='createGigButton' onClick={(e)=>{
        e.preventDefault()
        const errs=checkValidation(['title','description','price'],values)
        setErrors(errs)
        if(Object.keys(errs).length > 0)return
        fetch(`${import.meta.env.VITE_URL_SERVER}/api/gigs`,{
          method:'POST',
          headers:{
            'content-type':'application/json'
          }
          ,
          credentials:'include',
          body:JSON.stringify(values)
        }).then(data=>data.json())
        .then(data=>{
          if(data.mess && data.mess==='reLogin'){
            navigate('')
          }
        })
        setValues({title:'',description:'',price:''})
      }}>add</button>
        </div>
      </form>
    </div>
  )
}

export default CreateNewGig