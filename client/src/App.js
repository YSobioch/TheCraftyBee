import  PageHolder  from "./components/PageHolder";
import NavbarOne from "./components/NavbarOne";
import { NavbarTwo } from "./components/NavbarTwo"
import { Footer } from "./components/Footer";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { reducer } from './redux/storeState'

import './app.css'

const store = createStore(reducer);

function App() {
  return (
    <Provider store={store}>
      <div className="testingOut">
      <div >
        <NavbarOne />
        <div className="line"></div>
        <NavbarTwo />
      </div>
      <div className="line"></div>
      <div className="page-holder">
        <PageHolder />
        <Footer />
      </div>
      <div>
        
      </div>
      </div>
    </Provider>
  )
}

// async function getUser() {
//   let res = await fetch('http://localhost:8000/users/Yuri/123Password')
//   let user = await res.json()
//   setUser(user.User.username)
// } 

export default App;
