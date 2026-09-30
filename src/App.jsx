
import { BrowserRouter ,Routes,Route } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import Body from './Components/Body'
import Profile from './Components/Profile'
import Login from './Components/Login'
import Signup from './Components/Signup'
import appStore from './utils/appStore'
import { Provider } from "react-redux";
import Feed from './Components/Feed'

function App() {
  

  return (
    <>
    <Provider store = {appStore}>
    <BrowserRouter basename='/' >
    <Routes>
      <Route path="/" element={<Body/>}>
      <Route path="/login" element={<Login />}/>
      <Route path="/feed" element={<Feed />}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/signup" element={<Signup/>}/>
      
      </Route>
    </Routes>
    </BrowserRouter>
    </Provider>


      
    </>
  )
}

export default App
