
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import { removeUser } from '../utils/userSlice';

const Navbar = () => { 

  const user = useSelector((store)=>store.user)
  const dispatch = useDispatch();  
  const navigate = useNavigate()

  const handleLogout = async()=>{
    try{
      await axios.post(BASE_URL+"/logout",{},{withCredentials:true})
      dispatch(removeUser());
      return navigate("/login")


    }
    catch(err){
      console.error(err)

    }

  }

  const navLinkClass = ({ isActive }) =>
    `btn btn-sm shrink-0 rounded-full border border-transparent px-3 normal-case transition-colors ${
      isActive
        ? 'border-primary/20 bg-primary/10 font-semibold text-primary'
        : 'btn-ghost text-base-content/75 hover:border-base-content/10 hover:bg-base-100/70 hover:text-base-content'
    }`;

  
  return (
    <div>
         <div className="navbar flex-wrap gap-y-2 bg-base-300 px-3 shadow-sm sm:px-5">
  <div className="flex-1">
    <Link to="/feed" className="btn btn-ghost gap-2 text-xl">
      <img src="/devsphere-logo.png" alt="" className="h-10 w-10 rounded-full object-cover" />
      <span>DevSphere</span>
    </Link>
  </div>
  <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:gap-3">
     {user && <>
      <span className="hidden whitespace-nowrap text-sm font-semibold text-base-content/70 md:block">
        Welcome, {user.firstName}
      </span>
      <Link to="/profile" aria-label="Open profile" className="btn btn-ghost btn-circle avatar shrink-0">
        <div className="w-10 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-300">
          <img alt={`${user.firstName}'s profile`} src={user.photoUrl} />
        </div>
      </Link>
      <nav aria-label="Main navigation" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-1 sm:flex-none sm:gap-2">
        <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
        <NavLink to="/connections" className={navLinkClass}>Connections</NavLink>
        <NavLink to="/requests" className={navLinkClass}>Requests</NavLink>
        <NavLink to="/premium" className={navLinkClass}>Premium</NavLink>
        <button type="button" className="btn btn-sm btn-ghost shrink-0 rounded-full px-3 normal-case text-error hover:bg-error/10" onClick={handleLogout}>
          Logout
        </button>
      </nav>
     </>}
  </div>
</div>
      
    </div>
  )
}

export default Navbar;
