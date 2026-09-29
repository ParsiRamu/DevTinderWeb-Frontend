
import { BrowserRouter ,Routes,Route } from 'react-router-dom'
import './App.css'
import Navbar from './Navbar'
import Body from './Body'
import Profile from './Profile'
import Login from './Login'
import Signup from './Signup'

function App() {
  

  return (
    <>
    <BrowserRouter basename='/' >
    <Routes>
      <Route path="/" element={<Body/>}>
      <Route path="/login" element={<Login />}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/signup" element={<Signup/>}/>
      
      </Route>
    </Routes>
    </BrowserRouter>


      
    </>
  )
}

export default App
