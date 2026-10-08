
import axios from 'axios'
import { useEffect } from 'react'
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

   if(!requests) return null;

   if(requests.length === 0) return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Meet your next collaborator</p>
        <h1 className="mt-2 text-3xl font-bold">Requests</h1>
      </header>
      <div className="rounded-3xl border border-base-300 bg-base-200 px-6 py-14 text-center shadow-sm">
        <p className="text-xl font-semibold">No requests just yet</p>
        <p className="mt-2 text-base-content/65">New connection requests will appear here.</p>
      </div>
    </main>
   )

  return (   
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Meet your next collaborator</p>
        <h1 className="mt-2 text-3xl font-bold">Requests</h1>
        <p className="mt-2 text-base-content/65">Review developers who want to connect.</p>
      </header>
      <section className="space-y-4">
      {requests.map((request)=>{
        const {firstName,lastName,age,gender,about,photoUrl} = request.fromuserId;
        return (
            <article key={request._id} className="flex flex-col items-center gap-5 rounded-3xl border border-base-300 bg-base-200 p-5 text-center shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-start sm:p-6 sm:text-left">
                <div className="shrink-0 rounded-full bg-gradient-to-br from-secondary to-primary p-1 shadow-md">
                  <img
                    src={photoUrl}
                    className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
                    alt={`${firstName} ${lastName}`}
                  />
                </div>
                <div className="min-w-0 flex-1 self-center">
                    <h2 className="break-words text-xl font-bold sm:text-2xl">{firstName} {lastName}</h2>
                    {age && gender && <p className="mt-1 text-sm font-medium text-base-content/60">{age} · {gender}</p>}
                    <p className="mt-3 break-words leading-relaxed text-base-content/80">{about || "No introduction added yet."}</p>
                  </div>
                  <div className="flex w-full shrink-0 items-center justify-center gap-3 sm:w-auto sm:self-center">
                    <button className="btn btn-outline btn-error flex-1 sm:flex-none" onClick={()=>{reviewRequest("rejected",request._id)}}>Reject</button>
                    <button className="btn btn-secondary flex-1 sm:flex-none" onClick={()=>{reviewRequest("accepted",request._id)}}>Accept</button>
                </div>
            </article>
        )
      })}
      </section>
    </main>
  )
}

export default Requests
