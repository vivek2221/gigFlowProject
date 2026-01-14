


function SingleGig({status,gigId,setgigId,setVis,setId,buttonContent,title,description,price,id,IdUsedForBiding}) {
  return (
    <div className="eachSingleGig">
      <div className="title">
        title:{title}
      </div>
      <div style={{position:'absolute',right:'5px',top:'5px',color:`${status==='assigned'?'red':'green'}`}}>{status}</div>
      <div className="description">
        description:<br></br>{description}
      </div>
      <div className="buttonsInsideGig">
        <div>${price}</div>
       <button className="applyBtn" style={{display:`${status==='assigned'?'none':'flex'}`}} onClick={(e)=>{
        if(buttonContent==='apply'){
        setId(prev=>({...prev,id,Id:IdUsedForBiding,display:'block',top:'50%',left:'50%'}))}
        else {
          setgigId(gigId)
          setVis('flex')
        }
       }}>{buttonContent}</button>
      </div>
      </div>
  )
}

export default SingleGig