
import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

import axios from "axios" 
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';


const Login = () => {
  const [emailId,setEmailId] = useState("")
  const [firstName,setFirstName] = useState("")
  const [lastName,setlastName] = useState("")
  const [isLoginform ,setisLoginform]  = useState(false)
  const [passWord,setPassword] = useState("")
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogin  = async ()=>{
    try{const res = await axios.post(BASE_URL+"/login",{
      emailId,
      passWord,

    },{withCredentials:true})

   
    dispatch(addUser(res.data));
    return navigate("/feed")
  
  }
    catch(err){
      setError(err?.response?.data || "something went wrong!") 
      
    }
  }
  const handleSignup = async()=>{
    try{
      const res = await axios.post(BASE_URL+"/signup",{firstName,lastName,emailId,passWord},{withCredentials:true})
      console.log(res)
       dispatch(addUser(res?.data?.data));
      return navigate("/profile")
  
    }
    catch(err){
       setError(err?.response?.data || "something went wrong!")

    }
  }
  return (
    <div className='flex justify-center my-10'> 
     <div className="card card-border bg-base-300 w-96 my-20">
  <div className="card-body">
    <h2 className="card-title justify-center font-bold my-4 text-2xl">{isLoginform?"Login":"Signup"}</h2>
    <fieldset className="fieldset">
     {!isLoginform && 
     <><legend className="fieldset-legend text-2xl ">First Name:</legend>
  <input type="text"
  value={firstName}
   className="input" placeholder="Enter First Name " 
   onChange={(e)=>{
    setFirstName(e.target.value)
 }}/>
  <legend className="fieldset-legend text-2xl ">Last Name:</legend>
  <input type="text"
  value={lastName}
  className="input" placeholder="Enter Last Name " 
  onChange={(e)=>{
    setlastName(e.target.value)
  }}/> </>}
  <legend className="fieldset-legend text-2xl ">Email ID</legend>
  <input type="text"
  value={emailId}
   className="input" placeholder="Enter email " 
   onChange={(e)=>{
    setEmailId(e.target.value)
 }}/>
  <legend className="fieldset-legend text-2xl ">Password</legend>
  <input type="password"
  value={passWord}
  className="input" placeholder="Enter your Password" 
  onChange={(e)=>{
    setPassword(e.target.value)
  }}/>
  <p className='text-red-600 font-mono'>{error}</p>
  </fieldset>
    <div className="card-actions justify-end">
      <button className="btn btn-primary justify-center mx-35" onClick={isLoginform? handleLogin:handleSignup}>{isLoginform?"Login":"Signup"}</button>
      <p className='flex justify-between cursor-pointer' onClick={()=>setisLoginform((value)=>!value)}>{isLoginform?"New User Signup Here":"Existing User Login Here"}</p>
    </div>
  </div>
</div>
    </div>
  )
}

export default Login;
