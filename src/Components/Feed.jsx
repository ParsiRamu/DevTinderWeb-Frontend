
import { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice';
import UserCardd from './UserCardd';




const Feed = () => {
  const feed = useSelector((store)=>store.feed)
  
  const dispatch = useDispatch();
  const getfeed = async()=>{
   try{
     const res = await axios.get(BASE_URL+"/feed" ,{withCredentials:true})
     dispatch(addFeed(res?.data))
   }
   catch(err){
    console.error(err)

   }
  }

  useEffect(()=>{
    getfeed()
  },[])
   if(!feed) return ;

    if(feed.length ==0) return (
     <main className="network-page flex items-center justify-center px-4 py-10">
       <p className="network-card rounded-3xl px-8 py-6 text-center text-2xl font-bold">No users found</p>
     </main>
    )
  return (
     <main className="network-page flex justify-center px-4 py-10">
       {feed?.length > 0 && <UserCardd user={feed[0]} />}
     </main>
  )
}


export default Feed;
