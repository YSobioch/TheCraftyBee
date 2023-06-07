import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import ListingsHolder from '../components/LisitngsHolder'
import { AddFilterOption } from '../components/AddFilterOption'

import '../stylesheets/store.css'
import { Link } from 'react-router-dom'
import { CollectionsForm } from '../components/CollectionsForm'

function Store(props) {
    let [collections, setCollections] = useState([{name: 'loading'}])
    let [colors, setColors] = useState([])
    let [shapes, setShapes] = useState([])
    let [selectedColors, setSelectedColors] = useState({})
    let [selectedShapes, setSelectedShapes] = useState({})
    let [focusedCollection, setFocusedCollection] = useState(null)
    let [updated, setUpdated] = useState(false)

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
        setUpdated(false)
    }, [updated === true])

    const showPoppup = (id) => {
        console.log('called function')
        let element = document.getElementById(id)
        if(element.className !== '') {
            element.className = ''
        } else {
            element.className = 'hide-poppup'
            setUpdated(true)
        }
    }

    return (
        <>
        {props.user && props.user.admin ?
        <>
        <div id='collection-poppup' className='hide-poppup'>
            < CollectionsForm function={() => showPoppup('collection-poppup')} />
        </div>
        <div id='filter-poppup' className='hide-poppup'>
            <AddFilterOption shapes={shapes} colors={colors} function={() => showPoppup('filter-poppup')}/>
        </div>
        <div className='store-container'>
        <div className='left-panel'>
            <img src={require('../assets/shop.jpg')}  className='banner-img'/>
            <h1 className='banner-title'>Collections <span><Link className='admin-link' onClick={() => showPoppup('collection-poppup')}>+</Link></span></h1>
            <p className='collection-name' onClick={() => setFocusedCollection(null)}>All Products</p>
            {collections.map((collection, index) => {
                return <p className='collection-name' key={index} onClick={() => setFocusedCollection(collection)}>{collection.name}</p>
            })}
            <br></br>
            <h3 className='banner-title'>Filter <span><Link className='admin-link' onClick={() => showPoppup('filter-poppup')}>+</Link></span></h3>
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
                <ListingsHolder 
                    name={focusedCollection !== null ? focusedCollection.name : null} 
                    collection_id={focusedCollection !== null ? focusedCollection.id : null}
                    description={focusedCollection !== null ? focusedCollection.description : null}
                    shapeOptions={selectedShapes} colorOptions={selectedColors} admin={true}
                />
            </div>
        </div>
        </>
        : 
        <div className='store-container'>
        <div className='left-panel'>
            <img src={require('../assets/shop.jpg')}  className='banner-img'/>
            <h1 className='banner-title'>Collections</h1>
            <p className='collection-name' onClick={() => setFocusedCollection(null)}>All Products</p>
            {collections.map((collection, index) => {
                return <p className='collection-name' key={index} onClick={() => setFocusedCollection(collection)}>{collection.name}</p>
            })}
            <br></br>
            <h3 className='banner-title'>Filter </h3>
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
        }
        </>
    )
}

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps)(Store)