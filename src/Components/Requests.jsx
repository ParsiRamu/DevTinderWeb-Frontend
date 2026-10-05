
import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequest, removeRequest } from '../utils/requestSlice'

const Requests = () => {
    const dispatch = useDispatch();
    const requests = useSelector((store)=>store.request)


    // const reviewRequest = async(status,requestId)=>{
    //     try{
    //     const res = await axios.post(BASE_URL+"/request/review/"+status+"/"+requestId,{},{withCredentials:true})
    //     dispatch(removeRequest(requestId))

    //     }
    //     catch(err){
    //         console.error(err.response.data)

    //     }

    // } 
   const reviewRequest = async (status, requestId) => { 
    try {

        console.log("🟡 REQUEST ID:", requestId);

        const res = await axios.post(
            `${BASE_URL}/request/review/${status}/${requestId}`,
            {},
            { withCredentials: true }
        );

        console.log("🟢 API SUCCESS:", res.data);
 
        console.log("🟡 Dispatching removeRequest:", requestId);

        dispatch(removeRequest(requestId));

        console.log("🟢 Redux removeRequest dispatched");

    } catch (err) {
        console.error("🔴 ERROR:", err.response?.data || err);
    }
};

   const fetchRequest = async()=>{
    try{
        const res = await axios.get(BASE_URL+"/user/request/received",{withCredentials:true})
        console.log(res?.data?.connectionRequest)
        dispatch(addRequest(res?.data?.connectionRequest))
    }
    catch(err){
        console.error(err)

    }
   }

   useEffect(()=>{
    fetchRequest()
   },[])

   if(!requests) return ;

   if(requests.length==0) return <div className=' flex justify-center my-10 font-bold text-2xl '>No Requests Found</div>

  return (   
      <div className='text-center my-10'>
      <h1 className='text-bold text-2xl font-bold'>Requests</h1>
      {requests.map((request)=>{
        const {firstName,lastName,age,gender,about,photoUrl} = request.fromuserId;
        return (
            <div key={request._id} className='flex justify-between items-center m-4 p-4 rounded-lg bg-base-300 w-2/3 mx-auto'>
                <div><img src={photoUrl} className='w-90 h-40 rounded-full' alt="photo" /></div>
                <div className='text-left mx-4'>
                    <h2 className='text-2xl font-sans'>{firstName+" "+lastName}</h2>
               {age&& gender&& <p>{age+" , "+gender}</p>}
                <p>{about}</p>
                  </div>
                  <div className='flex items-center justify-center gap-3 '>
                    <button className="btn btn-primary" onClick={()=>{reviewRequest("rejected",request._id)}}>Reject</button>
                    <button className="btn btn-secondary" onClick={()=>{reviewRequest("accepted",request._id)}}>Accept</button>
                </div>
                
                
                
            </div>
        )
      })}

    </div>
  )
}

export default Requests
