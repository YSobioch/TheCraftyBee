import { connect } from "react-redux"
import { useParams } from "react-router-dom"
import initalState from "../redux/listingStateHelper"
import { useState, useEffect } from 'react'
import { PictureSelector } from "./PictureSelector"

import '../stylesheets/editlisting.css'

function AddAndEditListing(props) {
    let { id } = useParams()
    let [listing, setListing] = useState(initalState)
    let [collections, setCollections] = useState([])
    let [colors, setColors] = useState([])
    let [shapes, setShapes] = useState([])
    let [errorMessage, setErrorMessage] = useState("")
    let [hide, setHide] = useState(true)

    const getListing = async id => {
        const res = await fetch(`${process.env.REACT_APP_DOMAIN}/listings/${id}`)
        const newListing = await res.json()
        setListing(newListing)
    } 

    const getCollections = async () => {
        const res = await fetch(`${process.env.REACT_APP_DOMAIN}/collections`)
        const newCollections = await res.json()
        setCollections(newCollections)
    }
    
    const getColorsAndShapes = async () => {
        const res = await fetch(`${process.env.REACT_APP_DOMAIN}/colorsAndShapes`) 
        const newColorsAndShapes = await res.json()
        setColors(newColorsAndShapes.colors)
        setShapes(newColorsAndShapes.shapes)
    }

    const createListing = async () => {
        if(listing.pictures.length < 2) {
            setErrorMessage("You must have at least a two pictures per listing")
            return
        }
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/listings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: listing.name,
                description: listing.description, 
                description_long: listing.description_long, 
                collection: listing.collection, 
                color: listing.color, 
                shape: listing.shape, 
                price: listing.price, 
                saleAmount: listing.sale_amount
            })
        })
        let listingCreated = await res.json()
        if(listingCreated.createdListing) {
            let listingIdRes = await fetch(`${process.env.REACT_APP_DOMAIN}/listings/newestListing`)
            let listingId = await listingIdRes.json()
            listingId = listingId.listingId
            listing.pictures.map(async (picture, index) => {
                await fetch(`${process.env.REACT_APP_DOMAIN}/listingPictures`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        owner_id: listingId,
                        picture_id: picture.picture_id
                    })
                })
            })
        }
    }

    const updateListing = async () => {
        if(listing.pictures.length < 2) {
            setErrorMessage("You must have at least a two pictures per listing")
            return
        }
        setErrorMessage("")
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/listings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: listing.id,
                name: listing.name,
                description: listing.description, 
                description_long: listing.description_long, 
                collection: listing.collection, 
                color: listing.color, 
                shape: listing.shape, 
                price: listing.price, 
                saleAmount: listing.sale_amount
            })
        })
        let updated = await res.json()
        if(updated.updated) {
            console.log('updating pictures')
            await fetch(`${process.env.REACT_APP_DOMAIN}/listingPictures`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: listing.id
                })
            })
            listing.pictures.map(async (picture, index) => {
                await fetch(`${process.env.REACT_APP_DOMAIN}/listingPictures`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        owner_id: listing.id,
                        picture_id: picture.picture_id
                    })
                })
            })
        }
    }

    const deleteListing = async (deleted) => {
        if(!deleted) return
        console.log('deleting')
        await fetch(`${process.env.REACT_APP_DOMAIN}/listings`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: listing.id
            })
        })
    }

    const addPicture = (id, pictureName) => {
        setListing({...listing, pictures: [...listing.pictures, {picture_id: id}]})
    }

    const removePicture = (index) => {
        let pictureArr = [...listing.pictures]
        pictureArr.splice(index, 1)
        setListing({...listing, pictures: pictureArr})
    }

    useEffect(() => {
        if(id !== 'null') {
            getListing(id)
        }
        getCollections()
        getColorsAndShapes()
    }, [])

    if(props.user === null || !props.user.admin) return <h1>Not Permited</h1>

    return (
        <div className="edit-container">
            <h3>{errorMessage}</h3>
            <PictureSelector hide={hide} clickedOff={() => setHide(true)} function={addPicture} />
            <div className="edit-listing-holder">
                <div>
            <form>
                <input id='id' type="hidden" value={id} />
                <label>Name</label>
                <br></br>
                <input id='name' type="text" onChange={e => setListing({...listing, name: e.target.value})} value={listing.name} maxLength={45}></input>
                <br></br>
                <br></br>
                <label>Short Description</label>
                <br></br>
                <input id='description_s' type="text" onChange={e => setListing({...listing, description: e.target.value})} value={listing.description}></input>
                <br></br>
                <br></br>
                <label>Long Description</label>
                <br></br>
                <textarea id="description_l" onChange={e => setListing({...listing, description_long: e.target.value})} value={listing.description_long}></textarea>
                <br></br>
                <br></br>
                <div className="selection-grid">
                <label>Collection: </label>
                <select id='collection' onChange={e => setListing({...listing, collection: e.target.value})}>
                    <option value={null}>Select</option>
                    {collections.map((collection, index) => {
                        if(collection.id === listing.collection) {
                            return <option key={index} value={collection.id} selected>{collection.name}</option>
                        } else {
                            return <option key={index} value={collection.id}>{collection.name}</option>
                        }
                    })}
                </select>
                <label>Shape: </label>
                <select id='shape' onChange={e => setListing({...listing, shape: e.target.value})}>
                    <option value={null}>Select</option>
                    {shapes.map((shape, index) => {
                        if(shape.id === listing.shape) {
                            return <option key={index} value={shape.id} selected>{shape.shape}</option>
                        } else {
                            return <option key={index} value={shape.id}>{shape.shape}</option>
                        }
                        
                    })}    
                </select> 
                <label>Color: </label>
                <select id='color' onChange={e => setListing({...listing, color: e.target.value})}>
                    <option value={null}>Select</option>
                    {colors.map((color, index) => {
                        if(color.id === listing.color) {
                            return <option key={index} value={color.id} selected>{color.color}</option>
                        } else {
                            return <option key={index} value={color.id}>{color.color}</option>
                        }
                    })}
                </select>
                </div>
                <br></br>
                <br></br>
                <label>Price</label>
                <br></br>
                <input id="price" type="number" min={0} onChange={e => setListing({...listing, price: e.target.value})} value={listing.price}></input>
                <br></br>
                <br></br>
                <label>Sale Percent</label>
                <br></br>
                <input id='sale_amount' type="number" min={0} max={100} onChange={e => setListing({...listing, sale_amount: e.target.value})} value={listing.sale_amount}></input>
                <label>%</label>
            </form>
            <br></br>
            { id !== "null" ? 
                <div className="edit-btn-holder">
                    <button onClick={updateListing}>Update</button>
                    <button onClick={() => deleteListing(window.confirm("Delete Listing?"))}>Delete</button>
                </div> 
            : <button onClick={createListing}>Add Listing</button>}
            </div>
            <div className="edit-listing-picture-holder">
                <button onClick={() => setHide(false)}>Add Picture</button>
                <h3>Pictures:</h3>
                <div className="edit-listing-pictures">
                    {listing.pictures.map((picture, index) => {
                        return <img key={index} onClick={() => removePicture(index)} src={`${process.env.REACT_APP_DOMAIN}/pictures/${picture.picture_id}`} height='200px'/>
                    })}
                </div>
            </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(AddAndEditListing)