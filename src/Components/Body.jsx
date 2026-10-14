import { useCallback, useEffect } from 'react'
import Navbar from './Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'

const Body = () => { 
  const dispatch = useDispatch();
  const navigate  = useNavigate();
  const fetchuser = useCallback(async ()=>{
    try{
      const res  = await axios.get(BASE_URL+"/profile/view",{withCredentials:true})
      dispatch(addUser(res.data))
    }     
    catch(err){
      if(err.response?.status === 401){
        navigate("/login")
      } 
      console.error("token error",err)
    }
  }, [dispatch, navigate])

  useEffect(()=>{
    fetchuser()
  },[fetchuser])

  return (
    <div>
        <Navbar/>
        <Outlet />
        <Footer />
      
    </div>
  )
}

export default Body
