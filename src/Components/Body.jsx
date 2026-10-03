import React, { useDebugValue, useEffect } from 'react'
import Navbar from './Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'

const Body = () => {
  const dispatch = useDispatch();
  const navigate  = useNavigate();
  const userData = useSelector((store)=>store.user);

  const fetchuser = async ()=>{
    
    try{
      const res  = await axios.get(BASE_URL+"/profile/view",{withCredentials:true})
      dispatch(addUser(res.data))

    }
    
    catch(err){
      if(err.status = 401){
        navigate("/login")
      } 
    console.error("tokem error",err)}  
  }
   useEffect(()=>{
    fetchuser()
  },[])

  return (
    <div>
        <Navbar/>
        <Outlet />
        <Footer />
      
    </div>
  )
}

export default Body
