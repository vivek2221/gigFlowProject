import { useNavigate } from "react-router-dom"


function Button({content,navigateTo}) {
  const navigate=useNavigate()
  return (
    <div className="navbtn" onClick={()=>{
       navigate(`${navigateTo}`)
    }}>{content}</div>
  )
}

export default Button