import {Route, Routes} from "react-router-dom"
import { Home } from "../pages/Home"
import { Store } from "../pages/Store"
import { Cart } from "../pages/Cart"
import { Account } from "../pages/Account"
import { Admin } from "../pages/Admin"
import Listing from "../pages/Listing"

import '../stylesheets/pageholder.css'

export function PageHolder() {
    return (
        <div className="pageholder">
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/store" element={<Store />} />
                <Route path="/myCart" element={<Cart />} />
                <Route path="/myAccount" element={<Account />} />
                <Route path="/myAccount/Admin" element={<Admin />} />
                <Route path="/listing/:id" element={<Listing />} />
                <Route path="*" element={<h1>404 Not found</h1>} />
            </Routes>
        </div>
    
    )
}