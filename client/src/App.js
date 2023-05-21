import { PageHolder } from "./components/PageHolder";
import { NavbarOne } from "./components/NavbarOne";
import { NavbarTwo } from "./components/NavbarTwo"
import { Footer } from "./components/Footer";
import { createStore } from "redux";
import { Provider } from "react-redux";

const initalState = {
  userId: null,
  userName: null,
  userPassword: null,
  userEmail: null,
  userSubscribed: null,
  cart: []
}

const reducer = (state = initalState, action) => {
  let newCart;
  switch(action.type) {
    case "ADD_TO_CART":
      newCart = state.cart
      newCart.push(action.id)
      return {
        cart: newCart
      }
    case "REMOVE_FROM_CART":
      newCart = state.cart

    default:
      return state
  }
}

const store = createStore(reducer);

function App() {
  return (
    <Provider store={store}>
      <div>
        <NavbarOne />
        <NavbarTwo />
      </div>
      <div>
        <PageHolder />
      </div>
      <div>
        <Footer />
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
