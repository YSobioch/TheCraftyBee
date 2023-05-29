import { connect } from "react-redux"
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import initalState from "../redux/listingStateHelper"

function Listing({ dispatch }) {
    const { id } = useParams()
    const [listing, setListing] = useState(initalState)
    const [pictures, setPictures] = useState([])
    
    const getListing = async () => {
        const res = await fetch(`${process.env.REACT_APP_DOMAIN}/listings/${id}`)
        const listing = await res.json()
        const pictures = await listing.pictures
        setListing(listing)
        setPictures(pictures)
    }

    useEffect(() => {
        getListing()
    }, [])

    return (
        <>
        {listing.id !== null ? 
        <>
            <h1>{listing.name}</h1>
            {pictures.map(picture => {
                return <h2>{picture.picture_id}</h2>
            })}
            <h3>{listing.description}</h3>
        </>
        : <h1>404 not found</h1>}
        </>
    )
}

// const handleAddToCart = () => {
//     dispatch({ type: "ADD_TO_CART", listing: { id: id }});
// }

// const handleRemoveFromCart = () => {
//     dispatch({ type: "REMOVE_FROM_CART"});
// }

export default connect()(Listing);