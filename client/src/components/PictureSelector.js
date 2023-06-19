import { useEffect, useState } from "react"

import '../stylesheets/pictureselector.css'

export function PictureSelector(props) {
    const [pictures, setPictures] = useState([])
    const [selectedPicture, setSelectedPicture] = useState(null)
    const [needsReload, setNeedsReload] = useState(false)

    const getPictures = async () => {
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/pictures`)
        let newPictures = await res.json()
        setPictures(newPictures)
    }

    const handleClick = (id, pictureName) => {
        console.log(`Clicked on id:${id}, name:${pictureName}`)
        props.function(id, pictureName)
    }

    const addPicture = () => {
        const input = document.getElementById("new_picture")
        const inputFiles = input.files

        if(!inputFiles.length) {
            console.log('undefined files')
            setSelectedPicture(null)
            return
        }
        setSelectedPicture(URL.createObjectURL(inputFiles[0]))
    }

    const handleSubmit = async () => { 
        setTimeout(() => {
            setNeedsReload(true)
            setSelectedPicture(null)
        }, 1000)
    }

    useEffect(() => {
        getPictures()
        setNeedsReload(false)
    }, [needsReload])

    return (
        <>
        {props.hide ? <></> : 
        <div className='picture-selector-holder'>
        <div className="picture-selector-div">
            {!props.adminPage ?
            <div>
                <h3>Add Image</h3>
                <form action={`${process.env.REACT_APP_DOMAIN}/pictures/`} method="post" encType="multipart/form-data">
                <input type='file' onChange={addPicture} id="new_picture" name='new_picture' accept="image/png, image/jpeg"></input>
                <br></br>
                {selectedPicture != null ? <img height="200px" src={selectedPicture}></img> : <></>}
                <br></br>
                {selectedPicture != null ? <input type="submit" onClick={handleSubmit}/> : <></>}
                </form>
            </div>
            : <></>
            }
            <h3>Exisiting Images</h3>
            <div className="picture-selector">
                {pictures.map((picture, index) => {
                    return <img key={index} src={`${process.env.REACT_APP_DOMAIN}/pictures/${picture.id}`} 
                    className="picture-selector-picture" onClick={() => handleClick(picture.id, picture.picture)}/>
                })}
            </div>
            <button onClick={props.clickedOff} className="picture-selector-exit-button">x</button>
        </div>
    </div>
        }
        </>
    )
}