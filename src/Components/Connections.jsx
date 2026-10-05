
import React, { useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { addConnection } from '../utils/connectionSlice';
import { useDispatch, useSelector } from 'react-redux';

const Connections = () => {
    const connections = useSelector((store)=>store.connection)

    const dispatch = useDispatch();


    const fetchConnections = async()=>{
        try{
            const res = await axios.get(BASE_URL+"/user/connections",{withCredentials:true})
        console.log(res?.data?.data)
        dispatch(addConnection(res?.data?.data))
        }
        catch(err){
            console.error(err)
        }
    }

    useEffect(()=>{
        fetchConnections()
    },[])

    if(!connections) return ;

    if(connections.length ==0) return <div>No Connections</div>
  return (
    <div className='text-center my-10'>
      <h1 className='text-bold text-2xl font-bold'>Connections</h1>
      {connections.map((connection)=>{
        const {_id,firstName,lastName,age,gender,about,photoUrl} = connection;
        return (
            <div key={_id} className='flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto'>
                <div><img src={photoUrl} className='w-60 h-40 rounded-full' alt="photo" /></div>
                <div className='text-left mx-4'>
                    <h2 className='text-2xl font-sans'>{firstName+" "+lastName}</h2>
               {age&& gender&& <p>{age+" , "+gender}</p>}
                <p>{about}</p>
                </div>
                
                
                
            </div>
        )
      })}

    </div>
  )
}

export default Connections;
