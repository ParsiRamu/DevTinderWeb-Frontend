
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice';
import UserCardd from './UserCardd';




const Feed = () => {
  const feed = useSelector((store)=>store.feed)
  console.log(feed)
  console.log(feed[0])
  
  const dispatch = useDispatch();
  const getfeed = async()=>{
   try{
     const res = await axios.get(BASE_URL+"/feed" ,{withCredentials:true})
    //  console.log(res?.data)
     dispatch(addFeed(res?.data))
   }
   catch(err){
    console.error(err)

   }
  }

  useEffect(()=>{
    getfeed()
  },[])
  return (
    feed?.length > 0 &&
    <div className='flex justify-center my-10'>
     <UserCardd user = {feed[0]} />
    </div>
  )
}


export default Feed;
