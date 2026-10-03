
import React from 'react'

const UserCardd = ({user}) => {
    const {firstName,lastName,age,gender,about ,skills,photoUrl} = user;
  return (
   
    
    <div className="card bg-base-100 w-96 shadow-sm">
  <figure>
    <img
      src={photoUrl}
      alt="Shoes" />
  </figure>
  <div className="card-body">
    <h2 className="card-title text-black font-bold animate-bounce">{firstName}</h2>
    {age && gender&& <p>{age + " "+ gender}</p>}
    <p className='font-mono'>{about}</p>
    <div className="card-actions justify-center my-10 ">
     <button className="btn btn-active btn-primary">Ignore</button>
<button className="btn btn-active btn-secondary">Interested</button>
    </div>
  </div>
</div>


  )
}

export default UserCardd
