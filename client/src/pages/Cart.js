import { connect } from 'react-redux'
import { useEffect, useState } from 'react'

import '../stylesheets/cart.css'
import Checkbox from '../components/checkbox'


function Cart(props) {
    let [cart, setCart] = useState([])
    let [total, setTotal] = useState(0)
    let [checked, setChecked] = useState([])

    const getCartListings = async (id) => {
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/listings/${id}`)
        let listing = await res.json() 
        if(listing === null) handleRemoveFromCart(id)
        console.log("listing is " + listing)
        return listing 
    }

    const handleChecked = (index) => {
        let newChecked = [...checked]
        newChecked[index] = !newChecked[index]
        if(newChecked[index]) {
            setTotal(total + cart[index].price)
        } else {
            setTotal(total - cart[index].price)
        }
        setChecked(newChecked)
    }

    const handleRemoveFromCart = (id) => {
        props.dispatch({ type: "REMOVE_FROM_CART", id: id});
        window.localStorage.setItem('CRAFT_CART', JSON.stringify(props.cart))
    }

    const handleCheckOut = async () => {
        let ids = []
        let accountNum = props.user !== null ? props.user.id : 0;
        for(let i = 0; i < cart.length; i++) {
            if(!checked[i]) continue;
            ids.push(cart[i].id)
        }
        
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/cart/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: ids,
                account: accountNum
            })
        })

        let url = await res.json()
        window.location = url.url
    }

    useEffect(() => {
        let newCart = []
        let newChecked = []
        let runningTotal = 0;
        props.cart.forEach(async (id) => {
            let listing = await getCartListings(id)
            newCart.push(listing)
            newChecked.push(listing.in_stock)
            runningTotal = runningTotal + listing.price
            setTotal(runningTotal)
        })

        setChecked(newChecked)
        setCart(newCart)
    }, [props.cart])



    return (
        <div className="cart-container">
            <h3>Your Cart </h3>
            <div className='line'></div>
            <br></br>
            {cart.length ? 
            <>
            <div>
            {cart.map((listing, index) => {
                return (
                    <div key={index} className='cart-listing'>
                        <div className='checkbox-holder'>
                            <div onClick={listing.in_stock ? () => handleChecked(index) : () => console.log("Out of Stock")}>
                                <Checkbox checked={listing.in_stock ? checked[index] : false}/>
                            </div>
                        </div>
                        <img src={`${process.env.REACT_APP_DOMAIN}/pictures/${listing.pictures[0].picture_id}`}/>
                        <div className='cart-listing-info'>
                            <h3>{listing.name}</h3>
                            <p className='cart-listing-info-paragraph'>{listing.description}</p>
                            <p className='cart-listing-info-sold-status'>{listing.in_stock ? "IN STOCK" : "SOLD OUT" }</p>
                            <p></p>
                            <p className='cart-listing-info-removal' onClick={() => handleRemoveFromCart(`${listing.id}`)}>remove</p>
                        </div>
                        <div className='cart-listing-price'>
                            <h3>${(listing.price / 100).toFixed(2)}</h3>
                        </div>
                        
                    </div>
                )
            })}
            <br></br>
            <div className='line'></div>
            </div>
            <div className='cart-total'>
                <div className='cart-total-selector'>
                    <div>
                        <h3>Total: ${(total / 100).toFixed(2)}</h3>
                        <button onClick={handleCheckOut}>Checkout</button>
                    </div>
                    
                </div>
            </div>
            </>
            : <h3>No Items</h3> }
            <br></br>
        </div>
    )
}

const mapStateToProps = state => ({ cart: state.cart, user: state.user })

export default connect(mapStateToProps)(Cart)