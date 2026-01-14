import { useState } from "react"
import Content from "./Content"
import ContentBoxNav from "./ContentBoxNav"

function ContentBoxMainPage() {
  const [vis,setVis]=useState('none')
  const [currNotify,setCurrNotify]=useState('none')
  return (
    <div id="contentBox" onClick={(e)=>{
      if(vis==='flex'){
        setVis('none')
      }
    }}>
      <ContentBoxNav/>
      <Content currNotify={currNotify} setCurrNotify={setCurrNotify} setVis={setVis} vis={vis}/>
    </div>
  )
}

export default ContentBoxMainPage