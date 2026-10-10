
import { BrowserRouter ,Routes,Route } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import Body from './Components/Body'
import Profile from './Components/Profile'
import Login from './Components/Login'
import Signup from './Components/Signup'
import appStore from './utils/appStore'
import { Provider } from "react-redux";
import Feed from './Components/Feed'
import Connections from './Components/Connections'
import Requests from './Components/Requests'
import Premium from './Components/Premium'

function App() {
  

  return (
    <>
    <Provider store = {appStore}>
    <BrowserRouter basename='/' >
    <Routes>
      <Route path="/" element={<Body/>}>
      <Route path="/login" element={<Login />}/>
      <Route path="/feed" element={<Feed />}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/connections" element={<Connections/>}/>
      <Route path="/requests" element={<Requests/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/premium" element={<Premium/>}/>
      <Route path="/signup" element={<Signup/>}/>
      
      </Route>
    </Routes>
    </BrowserRouter>
    </Provider>


      
    </>
  )
}

export default App
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./App.css";

// import Body from "./Components/Body";
// import Profile from "./Components/Profile";
// import Login from "./Components/Login";
// import Signup from "./Components/Signup";
// import Feed from "./Components/Feed";

// import appStore from "./utils/appStore";
// import { Provider } from "react-redux";

// function App() {
//   return (
//     <Provider store={appStore}>
//       <BrowserRouter>
//         <Routes>

//           {/* Public pages */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />

//           {/* Application layout */}
//           <Route path="/" element={<Body />}>
//             <Route path="feed" element={<Feed />} />
//             <Route path="profile" element={<Profile />} />
//           </Route>

//         </Routes>
//       </BrowserRouter>
//     </Provider>
//   );
// }

// export default App;