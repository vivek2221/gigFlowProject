import Button from "./Button"


function ContentBoxNav() {
  return (
    <div className="ContentBoxNav">
        <Button content={'Create Gig'} navigateTo='./createGig'/>
        <Button content={'All Gigs'} navigateTo="./"/>
        <Button content={'My Gigs'} navigateTo="./myGigs"/>
    </div>
  )
}

export default ContentBoxNav