import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Registering from './Registering.jsx'
import { createRoot } from 'react-dom/client'
import './Main.css'
import Home from './Home.jsx'
import AllGigs from './AllGigs.jsx'
import Mygigs from './Mygigs.jsx'
import CreateNewGig from './CreateNewGig.jsx'
const root=createRoot(document.querySelector('#root'))
const routes=createBrowserRouter([
  {
    path:'/',
    element:<Registering Type='signIn'/>
  },
  {
    path:'/signIn',
    element:<Registering Type='login'/>
  },{
    path:'/home',
    element:<Home/>,
    children:
      [
        {
          path:'createGig',
          element:<CreateNewGig/>
        },
        {
          path:'',
          element:<AllGigs/>
        },{
          path:'myGigs',
          element:<Mygigs/>
        }
      ]
    }
  
])
root.render(<RouterProvider router={routes}/>)