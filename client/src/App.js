import { PageHolder } from "./components/PageHolder";
import { createStore } from "redux";

const initalState = {
  userId: null,
  userName: null,
  userPassword: null,
  userEmail: null,
  userSubscribed: null,
  cart: []
}

const reducer = (state = initalState, action) => {

}

const store = createStore(reducer);

function App() {
  return (
    <>
    <h1>NavBar Here</h1>
    <PageHolder />
    <h1>Footer here</h1>
    </>
  )
}

// async function getUser() {
//   let res = await fetch('http://localhost:8000/users/Yuri/123Password')
//   let user = await res.json()
//   setUser(user.User.username)
// } 

export default App;
