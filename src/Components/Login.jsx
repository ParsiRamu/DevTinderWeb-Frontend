
import { useState } from 'react'
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
    <main className="login-page flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10 sm:justify-end sm:px-10 lg:px-[8vw]">
      <div className="card w-full max-w-md border border-white/20 bg-slate-950/75 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="card-body gap-2 p-7 sm:p-9">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">DevSphere community</p>
          <h2 className="card-title justify-center py-2 text-3xl font-bold">
            {isLoginform ? "Welcome back" : "Join the community"}
          </h2>
          <p className="mb-3 text-center text-sm text-slate-300">
            {isLoginform ? "Sign in to pick up where you left off." : "Create an account and meet your next collaborator."}
          </p>
          <fieldset className="fieldset gap-1">
            {!isLoginform && (
              <>
                <label className="fieldset-legend text-slate-200" htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  className="input w-full border-white/15 bg-white/10 text-white placeholder:text-slate-400"
                  placeholder="Enter your first name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <label className="fieldset-legend text-slate-200" htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  className="input w-full border-white/15 bg-white/10 text-white placeholder:text-slate-400"
                  placeholder="Enter your last name"
                  onChange={(e) => setlastName(e.target.value)}
                />
              </>
            )}
            <label className="fieldset-legend text-slate-200" htmlFor="emailId">Email address</label>
            <input
              id="emailId"
              type="email"
              value={emailId}
              className="input w-full border-white/15 bg-white/10 text-white placeholder:text-slate-400"
              placeholder="Enter your email"
              onChange={(e) => setEmailId(e.target.value)}
            />
            <label className="fieldset-legend text-slate-200" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={passWord}
              className="input w-full border-white/15 bg-white/10 text-white placeholder:text-slate-400"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="mt-2 text-sm text-red-300" role="alert">{error}</p>}
          </fieldset>
          <div className="mt-4 flex flex-col gap-4">
            <button
              className="btn btn-primary w-full border-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-950/40"
              onClick={isLoginform ? handleLogin : handleSignup}
            >
              {isLoginform ? "Login" : "Create account"}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm text-slate-300 hover:bg-white/10 hover:text-white"
              onClick={() => setisLoginform((value) => !value)}
            >
              {isLoginform ? "New to DevSphere? Sign up" : "Already a member? Log in"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login;
