import {Route, Routes} from "react-router-dom"
import { Home } from "../pages/Home"
import { Store } from "../pages/Store"

export function PageHolder() {
    return (
    <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/store" element={<Store />} />
    </Routes>
    )
}