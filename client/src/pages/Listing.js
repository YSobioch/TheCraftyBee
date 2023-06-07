import { connect } from "react-redux"
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ListingPictureCarosel } from "../components/ListingPictureCarosel";
import initalState from "../redux/listingStateHelper"

import '../stylesheets/listing.css'


function Listing(props) {
    const { id } = useParams()
    const [listing, setListing] = useState(initalState)
    const [inCart, setInCart] = useState(props.cart.some(element => element === id))

    const getListing = async () => {
        const res = await fetch(`${process.env.REACT_APP_DOMAIN}/listings/${id}`)
        const newListing = await res.json()
        setListing(newListing)
    }

    const handleAddToCart = () => {
        props.dispatch({ type: "ADD_TO_CART", id: id});
        window.localStorage.setItem('CRAFT_CART', JSON.stringify(props.cart))
        setInCart(true)
    }

    const handleRemoveFromCart = () => {
        props.dispatch({ type: "REMOVE_FROM_CART", id: id});
        window.localStorage.setItem('CRAFT_CART', JSON.stringify(props.cart))
        setInCart(false)
    }

    useEffect(() => {
        getListing()
    }, [inCart])

    return (
        <>
        <br></br>
        <div className="listing-holder">
            <div className="listing-wrapper">
                <div className="listing-carosel-panel">
                    <ListingPictureCarosel pictures={listing.pictures} />
                </div>
                <div className="listing-info-panel">
                    <h3>{listing.name} {props.user !== null && props.user.admin ? <span><Link to={`/listing/AddAndUpdate/${listing.id}`}>Edit</Link></span> : <></>}</h3>
                    <div className="line"></div>
                    <p><i>{listing.description_long}</i></p>
                    <div className="listing-info-panel-div" >
                        {inCart ? <button onClick={handleRemoveFromCart}>REMOVE FROM CART</button> : <button onClick={handleAddToCart}>ADD TO CART - {(listing.price / 100).toFixed(2)}</button>}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

const mapStateToProps = state => ({
    cart: state.cart,
    user: state.user
})

export default connect(mapStateToProps)(Listing);