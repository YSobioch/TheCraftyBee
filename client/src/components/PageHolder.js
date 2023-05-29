import {Route, Routes} from "react-router-dom"
import { Home } from "../pages/Home"
import Store from "../pages/Store"
import { Cart } from "../pages/Cart"
import Account from "../pages/Account"
import { Admin } from "../pages/Admin"
import { Order } from "../components/Order"
import SignIn from "./SignInPoppup"
import Listing from "../pages/Listing"
import { connect } from "react-redux"
import { useEffect } from "react"

import '../stylesheets/pageholder.css'


function PageHolder(props) {

    useEffect(() => {
        const user = window.localStorage.getItem('CRAFT_USER')
        const cart = window.localStorage.getItem('CRAFT_CART')
        if(user !== null && cart !== null) {
            props.dispatch({
                type: "RELOAD",
                user: JSON.parse(user),
                cart: JSON.parse(cart)
            })
        }
    }, [])

    useEffect(() => {
        window.localStorage.setItem('CRAFT_USER', JSON.stringify(props.user))
        window.localStorage.setItem('CRAFT_CART', JSON.stringify(props.cart))
    }, [props.user, props.cart])

    return (
        <div className="pageholder">
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/store" element={<Store />} />
                <Route path="/myCart" element={<Cart />} />
                <Route path="/myAccount" element={<Account />} />
                <Route path="/myAccount/Admin" element={<Admin />} />
                <Route path="/listing/:id" element={<Listing />} />
                <Route path="/order/:id" element={<Order />} />
                <Route path="*" element={<h1>404 Not found</h1>} />
            </Routes>
        </div>
    
    )
}

const mapStateToProps = state => ({
    user: state.user,
    cart: state.cart
})

export default connect(mapStateToProps)(PageHolder)