import { useEffect, useState } from 'react'
import { PictureSelector } from './PictureSelector'

import '../stylesheets/signin.css'
import '../stylesheets/collectionsform.css'
import addPicture from '../assets/addPhoto.png'

export function CollectionsForm(props) {
    let [collections, setCollections] = useState([])
    let [selectedCollection, setSelectedCollection] = useState(null)
    let [previousSelectedId, setPreviousSelectedId] = useState(null)
    let [selectedPicture, setSelectedPicture] = useState(null)
    let [hidePictures, setHidePictures] = useState(true)
    let [nameValue, setNameValue] = useState('')
    let [descriptionValue, setDescriptionValue] = useState('')
    let [changed, setChanged] = useState(false)
    let [updated, setUpdated] = useState(false)

    const getCollections = async () => {
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/collections`)
        let collectionData = await res.json()

        setCollections(collectionData)
    }

    const handleCollectionChange = (id) => {
        if(previousSelectedId !== null) {
            let element = document.getElementById(previousSelectedId)
            element.className = 'collection-option'
        }
        if(id === null) {
            let element = document.getElementById('Add Collection')
            element.className = 'collection-option collection-selected'
            setPreviousSelectedId('Add Collection')
            return
        }
        setPreviousSelectedId(id)
        for(const collection of collections) {
            if(collection.id === id) {
                setSelectedCollection(collection)
                setNameValue(collection.name)
                setDescriptionValue(collection.description)
                setChanged(false)
                let element = document.getElementById(id)
                element.className = 'collection-option collection-selected'
                break;
            }
        }
    }

    const handleClickedOnPicture = (id, pictureName) => {
        setHidePictures(!hidePictures)
        if(selectedCollection === null) {
            setSelectedPicture(id)
        } else {
            setSelectedCollection({...selectedCollection, picture: id})
        }
        
        
        setChanged(true)
    }

    const handleUpdate = async () => {
        let id = selectedCollection.id
        let picture_id = document.getElementById('picture-id').value
        let name = document.getElementById('name').value
        let description = document.getElementById('description').value

        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/collections/updateCollection`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                name: name,
                description: description,
                picture: picture_id
            })
        })
        let updated = await res.json()
        if(updated.updated) {
            setUpdated(true)
            let element = document.getElementById(previousSelectedId)
            element.className = 'collection-option'
            props.function()
        }
    }

    const handleCreate = async () => {
        let id = selectedPicture
        let name = document.getElementById('name').value
        let description = document.getElementById('description').value

        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/collections`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: name,
                description: description,
                picture: id
            })
        })
        let updated = await res.json()
        if(updated.collectionCreated) {
            setSelectedCollection(null)
            setUpdated(true)
            props.function()
        }
    }

    const handleDelete = async () => {
        let id = selectedCollection.id
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/collections/${id}`, {
            method: 'DELETE'
        })

        let deleted = await res.json()
        if(deleted.deleted) {
            setUpdated(true)
            setPreviousSelectedId(null)
            props.function()
        }
    }

    const handleInput = (id, cb) => {
        cb(document.getElementById(id).value)
        
    }

    const handleFocus = (cb) => {
        cb("")
        setChanged(true)
    }

    useEffect(() => {
        setUpdated(false)
        setSelectedCollection(null)
        setSelectedPicture(null)
        
        getCollections()

    }, [updated])


    return (
        <div>
        <PictureSelector hide={hidePictures} 
            function={(id, pictureName) => handleClickedOnPicture(id, pictureName)}
            clickedOff={() => setHidePictures(!hidePictures)}/>
        <div className='collection-form-holder'>
            <div className='collection-div'>
                <h3 className='collection-selector-header'>Collections</h3>
                <div className='collection-button-container'>
                    {collections.map((collection, index) => {
                        return <p key={index} id={collection.id} onClick={() => handleCollectionChange(collection.id)} className='collection-option'>{collection.name}</p>
                    })}
                    <p className='collection-option' 
                        id='Add Collection'
                        onClick={() => {
                            setSelectedCollection(null)
                            setSelectedPicture(null)
                            handleCollectionChange(null)
                        }}>New Collection+</p>
                </div>
                <br></br>
                {selectedCollection !== null ?
                <div className='collection-info-container'>
                    <img src={`${process.env.REACT_APP_DOMAIN}/pictures/${selectedCollection.picture}`} 
                        onClick={() => handleClickedOnPicture()}/>
                    <br></br>
                    <form className='collection-info-form'>
                        <br></br>
                        <input id='picture-id' type='hidden' value={selectedCollection.picture}></input>
                        <input id='name' type='text' 
                            onFocus={() => handleFocus(setNameValue)} 
                            onInput={() => handleInput('name', setNameValue)} 
                            value={nameValue}></input>
                        <br></br>
                        <br></br>
                        <textarea id='description' 
                            onFocus={() => handleFocus(setDescriptionValue)} 
                            onInput={() => handleInput('description', setDescriptionValue)} 
                            value={descriptionValue}></textarea>
                        <br></br>
                        <br></br>
                        {changed ? 
                            <div className='update-button-holder'>
                                <p className='collection-option collection-selected' onClick={handleUpdate}>Update</p> 
                                <p className='collection-option collection-delete-button' onClick={handleDelete}>Delete Collection</p> 
                            </div>  
                        : 
                        <div className='update-button-holder'>
                            <p className='collection-option collection-delete-button' onClick={handleDelete}>Delete Collection</p> 
                        </div>}
                        
                    </form>
                </div>
                : 
                <div className='collection-info-container'>
                    <img src={selectedPicture !== null ? `${process.env.REACT_APP_DOMAIN}/pictures/${selectedPicture}` : addPicture}
                        onClick={() => handleClickedOnPicture()}/>
                    <br></br>
                    <form className='collection-info-form'>
                        <br></br>
                        <input id='picture-id' type='hidden' value={selectedPicture}></input>
                        <label>Collection Name</label>
                        <br></br>
                        <input id='name' type='text' onFocus={() => handleFocus(setDescriptionValue)} onInput={() => handleInput('name', setNameValue)}></input>
                        <br></br>
                        <br></br>
                        <label>Description</label>
                        <br></br>
                        <textarea id='description' 
                            onFocus={() => handleFocus(setDescriptionValue)}
                            onInput={() => handleInput('description', setDescriptionValue)}>
                            </textarea>
                        <br></br>
                        <br></br>
                        {changed ? 
                            <div className='update-button-holder'>
                                <p className='collection-option collection-selected' onClick={props.function}>Cancel</p> 
                                <p className='collection-option collection-delete-button' onClick={handleCreate}>Create</p> 
                            </div>  
                        : 
                        <div className='update-button-holder'>
                            
                        </div>}
                        
                    </form>
                </div>
                }
                <button className='collection-exit-button' onClick={props.function}>x</button>
            </div>
        </div>
        </div>
    )
}