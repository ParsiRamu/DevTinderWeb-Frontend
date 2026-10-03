
import React, { useState } from 'react'
import UserCardd from './UserCardd'
import { BASE_URL } from '../utils/constants'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { addUser } from '../utils/userSlice'

const EditProfile = ({user}) => {
    
    const [firstName,setfirstName] = useState(user.firstName)
    const [lastName,setlasttName] = useState(user.lastName)
    const [age,setAge] = useState(user.age)     
    const [gender,setGender] = useState(user.gender)
    const [about,setAbout] = useState(user.about)
    const [photoUrl,setPhotoUrl] = useState(user.photoUrl)
    const [error,setError] = useState(" ")
    const dispatch = useDispatch();
    const [showToast ,setshowToast] = useState(false)

    

    const saveProfile = async ()=>{
        try{
            setError(" ")
            const res = await axios.patch(BASE_URL+"/profile/edit",{firstName,lastName,age,gender,about,photoUrl},{withCredentials:true})
            console.log( "RES:",res)
            dispatch(addUser(res?.data?.data))
            setshowToast(true)
            setTimeout(()=>{
                setshowToast(false)
            },3000)


        }
        catch(err){
            console.error(err.response)
            setError(err?.response?.data)
            

        }
    }
  return (
    <>
    <div className='flex justify-center items-stretch gap-10 my-10'>
    <div className='flex justify-center my-10'>
        <div className='card-border bg-base-300 w-140  my-2 '>
            <p className='text-center mt-10 text-3xl font-medium animate-pulse'>Edit Profile</p>
        <fieldset className="fieldset mx-20 my-5">
  <legend className="fieldset-legend text-2xl">First Name:</legend>
  <input type="text" 
  value={firstName} className="input " placeholder="Type here" 
  onChange={(e)=>{
    setfirstName(e.target.value)
  }}/>
       </fieldset>
       <fieldset className="fieldset mx-20 my-5">
  <legend className="fieldset-legend text-2xl">Last Name:</legend>
  <input type="text" 
  value={lastName} className="input " placeholder="Type here" 
  onChange={(e)=>{
    setlasttName(e.target.value)
  }} />
       </fieldset>
       <fieldset className="fieldset mx-20 my-5">
  <legend className="fieldset-legend text-2xl">Age:</legend>
  <input type="text" 
  value={age} className="input " placeholder="Type here" 
  onChange={(e)=>{
    setAge(e.target.value)
  }}/>
       </fieldset>
       <fieldset className="fieldset mx-20 my-5">
  <legend className="fieldset-legend text-2xl">Gender:</legend>
  <input type="text" 
  value={gender} className="input " placeholder="Type here" 
   onChange={(e)=>{
    setGender(e.target.value)
  }}/>
       </fieldset>
  <fieldset className="fieldset mx-20 my-5">
  <legend className="fieldset-legend text-2xl">About</legend>
  <input type="text" 
  value={about} className="input " placeholder="Type here"
   onChange={(e)=>{
    setAbout(e.target.value)
  }} />
       </fieldset>
        <fieldset className="fieldset mx-20 my-5">
  <legend className="fieldset-legend text-2xl">photoUrl:</legend>
  <input type="text" 
  value={photoUrl} className="input " placeholder="Type here" 
   onChange={(e)=>{
    setPhotoUrl(e.target.value)
  }}/>
       </fieldset>
       <p className='font-bold  ml-4 text-red-700'>{error}</p>
 <button className="btn btn-info mx-45 mt-5 mb-5 text-2xl" onClick={saveProfile}>Save Info</button>
    </div>
    </div>
    <UserCardd user = {{firstName,lastName,age,gender,about ,photoUrl}}/>
    </div>
    {showToast &&
    <div className="toast toast-top toast-center">
  
  <div className="alert alert-success">
    <span>Profile Updated successfully.</span>
  </div>
</div>}
    </>
  )
}

export default EditProfile
