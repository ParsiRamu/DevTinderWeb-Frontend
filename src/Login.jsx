
import React, { useState } from 'react'
import axios from "axios" 


const Login = () => {
  const [emailId,setEmailId] = useState("elon@gmail.com")
  const [passWord,setPassword] = useState("Elon@123")
  const handleLogin  = async ()=>{
    try{const res = await axios.post("http://localhost:7777/login",{
      emailId,
      passWord,

    })}
    catch(err){
      console.log(err.message)
    }
  }
  return (
    <div className='flex justify-center my-10'>
     <div className="card card-border bg-base-300 w-96 my-20">
  <div className="card-body">
    <h2 className="card-title justify-center font-bold my-4 text-2xl">Login</h2>
    <fieldset className="fieldset">
  <legend className="fieldset-legend text-2xl ">Email ID</legend>
  <input type="text"
  value={emailId}
   className="input" placeholder="Enter email " 
   onChange={(e)=>{
    setEmailId(e.target.value)
 }}/>
  <legend className="fieldset-legend text-2xl ">Password</legend>
  <input type="text"
  value={passWord}
  className="input" placeholder="Enter your Password" 
  onChange={(e)=>{
    setPassword(e.target.value)
  }}/>
  </fieldset>
    <div className="card-actions justify-end">
      <button className="btn btn-primary justify-center mx-35" onClick={handleLogin}>Login</button>
    </div>
  </div>
</div>
    </div>
  )
}

export default Login;
