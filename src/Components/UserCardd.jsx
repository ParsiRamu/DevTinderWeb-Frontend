
import React from 'react'
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';

const UserCardd = ({user}) => {
    const {_id,firstName,lastName,age,gender,about ,skills,photoUrl} = user;
    const dispatch = useDispatch();

const handleSendRequest = async(status,userId)=>{
  try{
    const res = await axios.post(BASE_URL+"/request/send/"+status+"/"+userId,{},{withCredentials:true})
    console.log(res)
    dispatch(removeUserFromFeed(userId));
  }
  catch(err){

  }
}




  return (
   
    
    <div className="card bg-base-300 w-96 shadow-sm h-2/4 mt-30">
  <figure>
    <img
      src={photoUrl}
      alt="Shoes" />
  </figure>
  <div className="card-body">
    <h2 className="card-title text-black font-bold animate-bounce">{firstName+" "+lastName}</h2>
    {age && gender&& <p>{age + " , "+ gender}</p>}
    <p className='font-mono'>{about}</p>
    <div className="card-actions justify-center my-10 ">
     <button className="btn btn-active btn-primary" onClick={()=>{handleSendRequest("ignored",_id)}}>Ignore</button>
<button className="btn btn-active btn-secondary" onClick={()=>{handleSendRequest("interested",_id)}}>Interested</button>
    </div>
  </div>
</div>


  )
}

export default UserCardd
