import './App.css'
import { useEffect } from 'react'
import Home from './Pages/Home/Home'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import TestAI from './Pages/TestAI/TestAI'
import TestImage from './Pages/TestImage/TestImage'
import TestVideo from './Pages/TestVideo/TestVideo'
import Misbot from './Pages/MisBot/MisBot'



function App() {

const router = createBrowserRouter([
{
  path: '/',
  element: <> <Home/> </>
},
{
  path: '/testai',
  element: <> <TestAI/> </>
},
{
  path: '/testimage',
  element: <> <TestImage/> </>
},
{
  path: '/testvideo',
  element: <> <TestVideo/> </>
},
{
  path: '/misbot',
  element: <> <Misbot/> </>
},
])
  return(

  <div className="app-container">
<RouterProvider router={router} />
  </div>
  );
}

export default App
