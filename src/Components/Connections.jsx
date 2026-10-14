
import { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { addConnection } from '../utils/connectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Connections = () => {
    const connections = useSelector((store)=>store.connection)
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)


    useEffect(()=>{
        let isActive = true
        axios.get(BASE_URL+"/user/connections",{withCredentials:true})
            .then((res) => {
                const connectionList = res?.data?.data
                if (!Array.isArray(connectionList)) {
                    throw new Error("Connections response did not contain a list")
                }
                dispatch(addConnection(connectionList))
            })
            .catch((err) => {
                console.error(err)
                if (isActive) setHasError(true)
            })
            .finally(() => {
                if (isActive) setIsLoading(false)
            })
        return () => {
            isActive = false
        }
    },[dispatch])

    const connectionList = Array.isArray(connections) ? connections : []

    if (isLoading) return (
      <main className="network-page flex min-h-[50vh] items-center justify-center px-4 py-12">
        <div className="network-card rounded-3xl px-8 py-6 text-center" role="status">
          <span className="loading loading-spinner loading-md text-primary" aria-hidden="true"></span>
          <p className="mt-3 font-semibold">Loading your connections...</p>
        </div>
      </main>
    )

    if (hasError) return (
      <main className="network-page px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Your network</p>
            <h1 className="mt-2 text-3xl font-bold">Connections</h1>
          </header>
          <div className="network-card rounded-3xl px-6 py-10 text-center" role="alert">
            <p className="text-xl font-semibold">We couldn’t load your connections</p>
            <p className="mt-2 text-base-content/65">Please try again in a moment.</p>
          </div>
        </div>
      </main>
    )

    if(connectionList.length === 0) return (
      <div className="network-page px-4 py-12">
      <main className="mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Your network</p>
          <h1 className="mt-2 text-3xl font-bold">Connections</h1>
        </header>
        <div className="network-card rounded-3xl px-6 py-14 text-center">
          <p className="text-xl font-semibold">Your network starts here</p>
          <p className="mt-2 text-base-content/65">When you connect with developers, they’ll show up here.</p>
        </div>
      </main>
      </div>
    )
  return (
    <div className="network-page px-4 py-10 sm:px-6">
    <main className="mx-auto max-w-5xl">
      <header className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Your network</p>
        <h1 className="mt-2 text-3xl font-bold">Connections</h1>
        <p className="mt-2 text-base-content/65">Developers you’ve connected with.</p>
      </header>
      <section className="space-y-4">
      {connectionList.map((connection)=>{
        const {_id,firstName,lastName,age,gender,about,photoUrl} = connection;
        return (
            <article key={_id} className="network-card flex flex-col items-center gap-5 rounded-3xl p-5 text-center sm:flex-row sm:items-start sm:p-6 sm:text-left">
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
                    <Link to={"/chat/"+_id}><button className="btn btn-info">Chat</button></Link>
                </div>
            </article>
        )
      })}
      </section>
    </main>
    </div>
  )
}

export default Connections;
