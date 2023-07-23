import { useState } from "react"
import { connect } from "react-redux"
import { Link, useParams } from "react-router-dom"

import '../stylesheets/successPage.css'
import '../stylesheets/store.css'

function SuccessfulPurchase(props) {
    let purchasedData = useParams()
    let [itemsLeft, setItemsLeft] = useState(false)
    let itemsBought = parseItems(purchasedData.arr)
    let itemsInCart = JSON.parse(window.localStorage.getItem('CRAFT_CART'))
    for(let i = 0; i < itemsInCart.length; i++) {
        let id = itemsInCart[i]
        for(let item of itemsBought) {
            if(id === `${item}`) {
                props.dispatch({type: "REMOVE_FROM_CART", id: id})
                itemsInCart.splice(i, 1)
                setItemsLeft(true)
            }
        }
    };
    if(itemsLeft) window.localStorage.setItem('CRAFT_CART', JSON.stringify(itemsInCart))

    return (
        <div className="container">
            <div className="banner">
                <h1>Thank you for your order!</h1>
                <h3>----- Picture Here -----</h3>
                <h3>Check your email for confirmation receipt!</h3>
                <Link to='/'><button><h3>Back to home</h3></button></Link>
            </div>
        </div> 
    )
}

const parseItems = (itemsStr) => {
    let ItemArr = []
    let currentNumber = ""
    for(const char of itemsStr) {
        if(char === ",") {
            ItemArr.push(Number(currentNumber))
            currentNumber = ""
        } else {
            currentNumber += char
        }
    }
    ItemArr.push(Number(currentNumber))
    return ItemArr
}

export default connect()(SuccessfulPurchase)
