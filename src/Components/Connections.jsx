
import { useEffect } from 'react'
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

    if(!connections) return null;

    if(connections.length === 0) return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Your network</p>
          <h1 className="mt-2 text-3xl font-bold">Connections</h1>
        </header>
        <div className="rounded-3xl border border-base-300 bg-base-200 px-6 py-14 text-center shadow-sm">
          <p className="text-xl font-semibold">Your network starts here</p>
          <p className="mt-2 text-base-content/65">When you connect with developers, they’ll show up here.</p>
        </div>
      </main>
    )
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Your network</p>
        <h1 className="mt-2 text-3xl font-bold">Connections</h1>
        <p className="mt-2 text-base-content/65">Developers you’ve connected with.</p>
      </header>
      <section className="space-y-4">
      {connections.map((connection)=>{
        const {_id,firstName,lastName,age,gender,about,photoUrl} = connection;
        return (
            <article key={_id} className="flex flex-col items-center gap-5 rounded-3xl border border-base-300 bg-base-200 p-5 text-center shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-start sm:p-6 sm:text-left">
                <div className="shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary p-1 shadow-md">
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
            </article>
        )
      })}
      </section>
    </main>
  )
}

export default Connections;
