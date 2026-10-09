
import EditProfile from './EditProfile'
import { useSelector } from 'react-redux'

const Profile = () => {
  const user = useSelector((store)=>store.user)
  
  return (
    user &&
    <main className="network-page px-4 py-8 sm:px-6 sm:py-10">
      <EditProfile user = {user} />
    </main>
  )
}

export default Profile
