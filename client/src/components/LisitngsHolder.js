import { connect } from "react-redux"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import '../stylesheets/store.css'

function ListingsHolder(props) {
    let data = [{name: 'loading', pictures: [{picture_id: 0}, {picture_id: 0}]}]
    let [listings, setListings] = useState(data)

    const getListingsInCollection = async () => {
        let shapes = [];
        let colors = [];

        for(const [key, value] of Object.entries(props.shapeOptions)) {
            shapes.push(`shapes=${key}&`)
        }
        shapes = shapes.join('')

        for(const [key, value] of Object.entries(props.colorOptions)) {
            colors.push(`colors=${key}&`)
        }
        colors = colors.join('')

        let collectionId = props.collection_id;
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/listings/listingsInCollection?collection=${collectionId}&${shapes}${colors}`)
        let listings = await res.json()
        setListings(listings)
    }

    const insertDecimal = (num) => {
        return (num / 100).toFixed(2);
    }

    useEffect(() => {
        getListingsInCollection()
    }, [props.collection_id, props.shapeOptions, props.colorOptions])

    const handleAddToCart = (id) => {
        props.dispatch({ type: "ADD_TO_CART", id: id});
        window.localStorage.setItem('CRAFT_CART', JSON.stringify(props.cart))
    }

    const handleRemoveFromCart = (id) => {
        props.dispatch({ type: "REMOVE_FROM_CART", id: id});
    }

    return (
        <>
        <h1 className="collection-title">{props.name ? props.name : 'All Products'}</h1>
        {props.admin ? <Link to={`/listing/AddAndUpdate/null`} className="admin-link"><h3>Add listing</h3></Link> : <></>}
        <br></br>
        <div className="listing-grid">
            {listings.map((listing, index) => {
                return (
                    <div className="listing">
                        <Link to={`/listing/${listing.id}`}><img src={`${process.env.REACT_APP_DOMAIN}/pictures/${listing.pictures[0].picture_id}`} className="primary"/></Link>
                        <div className="info-holder primary">
                            <h1>{listing.name}</h1>
                            <p className="description"><i>{listing.description}</i></p>
                            <p className="price">$ {insertDecimal(listing.price)}</p>
                        </div>
                        <Link to={`/listing/${listing.id}`}><img src={`${process.env.REACT_APP_DOMAIN}/pictures/${listing.pictures[1].picture_id}`} className="secondary"/></Link>
                        <div className="listing-line slow-transition"></div>
                        <div className="info-holder secondary">
                            <h1>{listing.name}</h1>
                            <p className="description"><i>{listing.description}</i></p>
                            <div className="button-holder slow-transition">
                                {props.cart.indexOf(`${listing.id}`) > -1 ? 
                                    <button className="cart-button" onClick={() => handleRemoveFromCart(`${listing.id}`)}>REMOVE FROM CART</button> 
                                    : <button className="cart-button" onClick={() => handleAddToCart(`${listing.id}`)}>ADD TO CART - ${insertDecimal(listing.price)}</button> 
                                }
                            </div>
                        </div>
                    </div>
                )
            })}
            {/* {listings.map((listing, index) => {
                return (
                    <div className="listing">
                        <img src={`${process.env.REACT_APP_DOMAIN}/pictures/${listing.pictures[0].picture_id}`} className="primary"/>
                        <div className="info-holder primary">
                            <h1>{listing.name}</h1>
                            <p className="description"><i>{listing.description}</i></p>
                            <p className="price">$ {insertDecimal(listing.price)}</p>
                        </div>
                        <img src={`${process.env.REACT_APP_DOMAIN}/pictures/${listing.pictures[1].picture_id}`} className="secondary"/>
                        <div className="listing-line slow-transition"></div>
                        <div className="info-holder secondary">
                            <h1>{listing.name}</h1>
                            <p className="description"><i>{listing.description}</i></p>
                            <div className="button-holder slow-transition">
                                <button className="cart-button">ADD TO CART - ${insertDecimal(listing.price)}</button>
                            </div>
                        </div>
                    </div>
                )
            })} */}
        </div>
        <div className="spacer">

        </div>
        </>
    )
}

const mapStateToProps = state => ({ cart: state.cart})

export default connect(mapStateToProps)(ListingsHolder)