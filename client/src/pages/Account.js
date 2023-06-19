import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Admin } from "../components/Admin"
import { PurchaseHistory } from "../components/PurchaseHistory"

import '../stylesheets/store.css'
import '../stylesheets/account.css'
import '../app.css'


function Account(props) {
    const [accountSelected, setAccountSelected] = useState("Account Info")
    const [showPasswordChange, setShowPasswordChange] = useState("hide-password-change")
    const [subscribed, setSubscribed] = useState(0)
    const [password, setPassword] = useState("loading")
    const [lastButton, setLastButton] = useState("Account Info")
    const [user, setUser] = useState({
        email: "loading",
        password: "loading",
        subscribed: 0,
        admin: "loading",
        id: null,
    })

    const handleLoggout = () => {
        props.dispatch({type: "LOG_OUT"})
    }

    useEffect(() => {
        const user = window.localStorage.getItem('CRAFT_USER')
        const cart = window.localStorage.getItem('CRAFT_CART')
        if(user !== null && cart !== null) {
            props.dispatch({
                type: "RELOAD",
                user: JSON.parse(user),
                cart: JSON.parse(cart)
            })
            setUser(JSON.parse(user))
            setSubscribed(user.subscribed)
            setPassword(JSON.parse(user).password)
        }
    }, [subscribed, password])

    //Account changing section ---------------------------------------------------------------------------
    const changeSubscriptionStatus = async () => {
        let changedSubscribed = !props.user.subscribed
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/users/updateUserSubscription`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                change: changedSubscribed,
                password: props.user.password,
                email: props.user.email
            })
        })
        let change = await res.json()
        if(change.changedSubscription) {
            props.dispatch({
                type: "SIGN_IN",
                user: {...props.user, "subscribed": changedSubscribed ? 1 : 0}
            })
            setSubscribed(changedSubscribed ? 1 : 0)
        }
    }

    const changePasswords = async () => {
        const oldPassword = document.getElementById("old-password").value
        const newPassword = document.getElementById("new-password").value
        const newPasswordTwo = document.getElementById("re-new-password").value

        if(newPassword === newPasswordTwo) {
            let res = await fetch(`${process.env.REACT_APP_DOMAIN}/users/updateUserPassword`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: props.user.email,
                    password: oldPassword,
                    newPassword: newPassword
                })
            })
            let change = await res.json()
            if(change.changedPassword) {
                props.dispatch({
                    type: "SIGN_IN",
                    user: {...props.user, "password": newPassword}
                })
                setPassword(newPassword)
                document.getElementById("old-password").value = ""
                document.getElementById("new-password").value = ""
                document.getElementById("re-new-password").value = ""
            } else {
                console.log(change)
            }
        }
    }
    //--------------------------------------------------------------------------------------------------

    const hidePassword = (password) => {
        
        let newPassword = []
        for(let letter of password) {
            newPassword.push(letter)
        }
        newPassword.fill('*', 3)

        return newPassword.join('')
    }

    const accountSelectedHandler = (input) => {
        let currentElement = document.getElementById(lastButton)
        let newElement = document.getElementById(input)
        currentElement.className = "account-info-selector"
        newElement.className = "account-info-selector button-selected"

        setAccountSelected(input);
        setLastButton(input)
    }

    const display = accountSelected => {
        switch(accountSelected) {
            case "Account Info":
                return accountInfo;
            case "Purchase History":
                return <PurchaseHistory userId={user.id}/>; 
            case "Admin":
                return <Admin />
        }
    }

    //What gets displayed when the buttons are pressed *****************************************************************************************************************************
    const accountInfo = <div className="account-info-holder">
        <div className="account-info-holder">
            <p>Email: {user.email}</p>
            <p>Password: {hidePassword(password)}</p>
            <p>Subscribed: {user.subscribed ? "Yes" : "No"}</p>
        </div>
        <br></br>
        <br></br>
        <div className="btn-holder">
            <button onClick={() => {showPasswordChange === "hide-password-change" ? setShowPasswordChange("") : setShowPasswordChange("hide-password-change")}}>Change Password</button>
            <button onClick={() => {changeSubscriptionStatus()}}>{user.subscribed ? "Unsubscribe from Newsletter" : "Subscribe to Newsletter"}</button>
        </div>
        <br></br>
        <div className={showPasswordChange}>
            <form>
                <label>Old Password</label>
                <br></br>
                <input id="old-password" type="text"></input>
                <br></br>
                <br></br>
                <label>Enter New Password</label>
                <br></br>
                <input id="new-password" type="text"></input>
                <br></br>
                <br></br>
                <label>Re-Enter Password</label>
                <br></br>
                <input id="re-new-password" type="text"></input>
            </form>
            <br></br>
            <button onClick={() => {changePasswords()}}>Change Password</button>
        </div>
    </div>

    // const handlePurchaseHistory = () => {
        
    //     console.log(receipts)
    //     let orders = []
    //     for(const order of receipts) {
    //         orders.push(
    //             <tr>
    //                 <td>#{order.id}</td>
    //                 <td>{order.date.slice(0, 10)}</td>
    //                 <td>${order.total}</td>
    //             </tr>
    //         )
    //     }
    //     return (
    //         <div>
    //             <table className="purchase-history-table">
    //                 <tr>
    //                     <th>Order</th>
    //                     <th>Date</th>
    //                     <th>Total</th>
    //                 </tr>
    //                 {orders.map((order, index) => {
    //                     return order
    //                 })}
    //             </table>
    //         </div>
    //     )
    // }
    //*************************************************************************************************************************************************************e */

    return (
        <div className="store-container">
            <div className="left-panel">
                <br></br>
                <br></br>
                <h5 className="account-title">{user.email}</h5>
                <div className="line"></div>
                <p id="Account Info" className="account-info-selector button-selected" onClick={() => accountSelectedHandler("Account Info")}>Account Info</p>
                <p id="Purchase History" className="account-info-selector" onClick={() => accountSelectedHandler("Purchase History")}>Purchase History</p>
                {user.admin ? 
                <p id="Admin" className="account-info-selector" onClick={() => accountSelectedHandler("Admin")}>Admin</p>
                : <></>}
                <button className="account-btn"><Link className="account-link" to="/" onClick={() => handleLoggout()}>LOG OUT</Link></button>
            </div>
            <div className="right-panel"> 
                <div className="account-info">
                    <h2>{accountSelected}</h2> 
                    <br></br>
                    {display(accountSelected)}
                </div>
            </div>
            
        </div>
    )
}

const mapStateToProps = state => ({ user: state.user })

export default connect(mapStateToProps)(Account)