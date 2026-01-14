import { useEffect, useRef, useState } from "react"
import CustomInput from "./CustomInput.jsx"
import { useGSAP } from "@gsap/react"
import gsap from 'gsap'
import { Link, useNavigate } from "react-router-dom"

function SubLogin({Type}){
    let verifyContainer=useRef()
    const {contextSafe}=useGSAP({scope:verifyContainer})
    let animateButton=contextSafe((e)=>{
        gsap.to('#movingcircleAnimation',{
            display:'block',
            scale:1,
            top:`${e.nativeEvent.offsetY}`,
            left:`${e.nativeEvent.offsetX}`,
            ease:'power3.out'
        })
    })
    let leaveAnimation=contextSafe((e)=>{
        gsap.to('#movingcircleAnimation',{
            scale:0
        })
    })
    let clickAnimationOnSignIn=contextSafe(()=>{
        if(Type==='login'){
        gsap.to('#mainDivLogin #verificationMainPage',{
            display:'flex'
        })}
    })
    let verifyToLogin=contextSafe(()=>{
        if(Type==='login'){
        gsap.to('#verificationMainPage',{
            display:'none'
        })}
    })
    useGSAP(()=>{
        const tl=gsap.timeline()
        tl.from('#loginBoxDiv',{
            scale:0
        })
        tl.to('.inputClasses ',{
            width:'90%',
            paddingLeft:'10px',
            duration:0.3,
        })
        
    })
    const validations={
        name:[{required:true,message:'name required'}],
        email:[{required:true,message:'email required'},{regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,message:'enter valid email'}],
        password:[{required:true,message:'password required'},{minLength:4,message:'password must be greater than 3'}],
        otp:[{required:true,message:'enter the otp'},{isNum:true,message:'numbers are only allowed'},{min:1000,message:'otp must be of 4 digits long'},{max:10000,message:"otp must be of 4 digit long"}]
    }
    const [values,setValues]=useState({name:'',otp:'',email:'',password:''})
    const [errors,setErrors]=useState({})
    const checkValidation=(val)=>{
        let err={}
        val.forEach((keys)=>{
            if (!validations[keys]) return
            validations[keys].some((ele)=>{
                if(ele.required && values[keys].trim()===''){
                    err[keys]=ele.message
                    return true
                }
                if(ele.minLength && values[keys].length<ele.minLength){
                    err[keys]=ele.message
                    return true
                }
                if(ele.regex && !(ele.regex).test(values[keys])){
                    err[keys]=ele.message
                    return true
                }
                if(ele.isNum){
                    const numb=Number(values[keys])
                    if(!numb){
                        err[keys]=ele.message 
                        return true                       
                    }
                }
                if(ele.min && values[keys]<ele.min){
                    err[keys]=ele.message
                    return true
                }
                if(ele.max && values[keys]>ele.max){
                    err[keys]=ele.message
                    return true
                }
            })
        })
        return err
    }
        
    const buttonClickFunction=(e)=>{
        e.preventDefault()
        const er=checkValidation(['name','email','password'])
        setErrors({...er})
        if(Object.keys(er).length)return
        clickAnimationOnSignIn()
        fetch(`${import.meta.env.VITE_URL_SERVER}/${Type==="signIn"?"api/auth/login":"api/otp"}`,{
            method:`${Type==='signIn'?'POST':'PUT'}`,
            headers:{
                'content-type':'application/json'
            },
            credentials:'include',
            body:JSON.stringify(values)
        })
        .then(data=>data.json())
        .then((data)=>{
            if(data.mess==='go' && Type==='signIn'){
                localStorage.setItem("name",data.name)
                navigate('/home',{state:{name:data.name}})
            }
        })
    }
    const buttonVerifyOtp=(e)=>{
       e.preventDefault()
       const otpErr=checkValidation(['otp'])
                    setErrors({...otpErr})
        if(Object.keys(otpErr).length)return
        verifyToLogin()
        fetch(`${import.meta.env.VITE_URL_SERVER}/${Type==="signIn"?"api/auth/login":"api/auth/register"}`,{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            credentials:'include',
            body:JSON.stringify(values)
        })
        .then(data=>data.json())
        .then((data)=>{
            if(data.mess==='go' && Type!=='signIn'){
              navigate('/')
            }
        })
        
    }
    // main ui logic started from here
    let contentToShow=Type==='signIn'?"don't have an account?":"Already have an Account?"
    const navigate=useNavigate()
    useEffect(()=>{
      if(Type==='signIn'){
        fetch(`${import.meta.env.VITE_URL_SERVER}/${Type==="signIn"?"api/auth/login":"api/otp"}`,{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            credentials:'include',
            body:JSON.stringify(values)
        })
        .then(data=>data.json())
        .then((data)=>{
            if(data.mess==='go' && Type==='signIn'){
                localStorage.setItem("name",data.name)
                navigate('/home',{state:{name:data.name}})
            }
        })
      }
    },[])
    return (
        <div ref={verifyContainer} id='mainDivLogin'>
            <div id="forColorBlur">
                 <div id='loginBoxDiv'>
                <div id="imageNearFormDiv">
                    <img src='./loginPageMainImage.png' id="loginPageImage" alt='imageLogo'></img>
                </div>
                <div id='svgLineDiv'>
                </div>
                <form id="form" >
                    <div id="LogoMainPageLogin" >GigFlow</div>
                    <CustomInput inputHint='name' classForDivs="classForComponentInputDiv"  classN="inputClasses" inputValue={values.name} setValues={setValues} error={errors.name}/>
                    <CustomInput inputHint='email' classForDivs="classForComponentInputDiv" classN="inputClasses" inputValue={values.email} setValues={setValues} error={errors.email}/>
                    <CustomInput inputHint='password' classForDivs="classForComponentInputDiv" classN="inputClasses" inputValue={values.password} setValues={setValues} error={errors.password}/>
                    <button  id="loginButton"  onMouseLeave={leaveAnimation}  onMouseMove={animateButton} 
                    onClick={buttonClickFunction}>
                            <div id="movingcircleAnimation"></div>
                        <div id="movingAnimationInsideButton">{Type==='signIn'?'login':'signIn'}</div>
                        </button>
                        <div >{contentToShow} &nbsp;<Link className="infoDiv" to={Type==='signIn'?'/signIn':'/'}>{Type}</Link></div>
                </form>
            </div>
            </div>
            {/* otp verification page */}
            <div id="verificationMainPage" >
                <div id="verificationBoxDiv">
                    <div>Enter OTP</div>
                    <CustomInput inputHint='otp' classForDivs="otpDivInput" classN="otpInput" inputValue={values.otp} setValues={setValues} error={errors.otp}/>
                    <button id="verifyButtonOtp" onClick={buttonVerifyOtp}>verify</button>
                </div>
            </div>
        </div>
    )
}
export default SubLogin