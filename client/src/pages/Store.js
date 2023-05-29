import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import ListingsHolder from '../components/LisitngsHolder'

import '../stylesheets/store.css'
import { Link } from 'react-router-dom'

function Store(props) {
    let [collections, setCollections] = useState([{name: 'loading'}])
    let [colors, setColors] = useState([])
    let [shapes, setShapes] = useState([])
    let [selectedColors, setSelectedColors] = useState({})
    let [selectedShapes, setSelectedShapes] = useState({})
    let [focusedCollection, setFocusedCollection] = useState(null)

    const getCollections = async () => {
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/collections`)
        let collection = await res.json()
        setCollections(collection)
    }

    const getColorsAndShapes = async () => {
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/colorsAndShapes`)
        let colorsAndShapes = await res.json()
        setColors(colorsAndShapes.colors)
        setShapes(colorsAndShapes.shapes)
    }

    const handleShapes = async (id) => {
        let newShapes = {...selectedShapes}
        if(id in newShapes) {
            delete newShapes[id]
        } else {
            newShapes[id] = id
        }
        setSelectedShapes(newShapes)
        let element = document.getElementById(`shape-${id}`)
        if(element.className === 'filter-option') {
            element.className = 'filter-option filter-selected'
        } else {
            element.className = 'filter-option'
        }
    }

    const handleColors = async (id) => {
        let newColors = {...selectedColors}
        if(id in newColors) {
            delete newColors[id]
        } else {
            newColors[id] = id
        }
        setSelectedColors(newColors)
        let element = document.getElementById(`color-${id}`)
        if(element.className === 'filter-option') {
            element.className = 'filter-option filter-selected'
        } else {
            element.className = 'filter-option'
        }
    }

    useEffect(() => {
        getCollections()
        getColorsAndShapes()
    }, [])



    return (
        <>
        {props.user && props.user.admin ?
        <div className='store-container'>
        <div className='left-panel'>
            <img src={require('../assets/shop.jpg')}  className='banner-img'/>
            <h1 className='banner-title'>Collections <span><Link className='admin-link'>+</Link></span></h1>
            <p className='collection-name' onClick={() => setFocusedCollection(null)}>All Products</p>
            {collections.map((collection, index) => {
                return <p className='collection-name' key={index} onClick={() => setFocusedCollection(collection)}>{collection.name}</p>
            })}
            <br></br>
            <h3 className='banner-title'>Filter <span><Link className='admin-link'>+</Link></span></h3>
            <h4 className='filter-title'>Type</h4>
            <div className='filter-options-holder'>
                {shapes.map((shape, index) => {
                    return <p key={index} id={`shape-${shape.id}`} className='filter-option' onClick={() => handleShapes(shape.id)}>{shape.shape}</p>
                })}
            </div>
            <h4 className='filter-title'>Color</h4>
            <div className='filter-options-holder'>
                {colors.map((color, index) => {
                    return <p key={index} id={`color-${color.id}`} className='filter-option' onClick={() => handleColors(color.id)}>{color.color}</p>
                })}
            </div>

        </div>
            <div className='right-panel'>
                <ListingsHolder name={focusedCollection !== null ? focusedCollection.name : null} collection_id={focusedCollection !== null ? focusedCollection.id : null}
                    shapeOptions={selectedShapes} colorOptions={selectedColors}
                />
            </div>
        </div>
        : 
        <div className='store-container'>
        <div className='left-panel'>
            <img src={require('../assets/shop.jpg')}  className='banner-img'/>
            <h1 className='banner-title'>Collections</h1>
            <p className='collection-name' onClick={() => setFocusedCollection(null)}>All Products</p>
            {collections.map((collection, index) => {
                return <p className='collection-name' key={index} onClick={() => setFocusedCollection(collection)}>{collection.name}</p>
            })}
            {props.user && props.user.admin ? <p className='collection-name' onClick={() => setFocusedCollection(null)}>Add Collection +</p> : <></>}
        </div>
        <div className='right-panel'>
            <ListingsHolder name={focusedCollection !== null ? focusedCollection.name : null} collection_id={focusedCollection !== null ? focusedCollection.id : null}/>
        </div>
        </div>
        }
        </>
    )
}

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps)(Store)