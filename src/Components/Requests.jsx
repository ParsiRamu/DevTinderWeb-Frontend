
import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequest } from '../utils/requestSlice'

const Requests = () => {
    const dispatch = useDispatch();
    const requests = useSelector((store)=>store.request)


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

   if(requests.length==0) return <div>No Requests Found</div>

  return (
      <div className='text-center my-10'>
      <h1 className='text-bold text-2xl font-bold'>Connections</h1>
      {requests.map((request)=>{
        const {_id,firstName,lastName,age,gender,about,photoUrl} = request.fromuserId;
        return (
            <div key={_id} className='flex justify-between items-center m-4 p-4 rounded-lg bg-base-300 w-2/3 mx-auto'>
                <div><img src={photoUrl} className='w-90 h-40 rounded-full' alt="photo" /></div>
                <div className='text-left mx-4'>
                    <h2 className='text-2xl font-sans'>{firstName+" "+lastName}</h2>
               {age&& gender&& <p>{age+" , "+gender}</p>}
                <p>{about}</p>
                  </div>
                  <div className='flex items-center justify-center gap-3 '>
                    <button className="btn btn-primary">Reject</button>
                    <button className="btn btn-secondary">Accept</button>
                </div>
                
                
                
            </div>
        )
      })}

    </div>
  )
}

export default Requests
