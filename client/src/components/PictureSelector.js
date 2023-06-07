import { useEffect, useState } from "react"

import '../stylesheets/pictureselector.css'

export function PictureSelector(props) {
    const [pictures, setPictures] = useState([])
    const [selectedPicture, setSelectedPicture] = useState(null)

    const getPictures = async () => {
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/pictures`)
        let newPictures = await res.json()
        setPictures(newPictures)
    }

    const handleClick = (id, pictureName) => {
        console.log(`Clicked on id:${id}, name:${pictureName}`)
        props.function(id, pictureName)
    }

    useEffect(() => {
        getPictures()
    }, [])

    return (
        <>
        {props.hide ? <></> : 
        <div className='picture-selector-holder' onClick={props.clickedOff}>
        <div className="picture-selector-div">
            <h3>Images</h3>
            <div className="picture-selector">
                {pictures.map((picture, index) => {
                    return <img key={index} src={`${process.env.REACT_APP_DOMAIN}/pictures/${picture.id}`} 
                    className="picture-selector-picture" onClick={() => handleClick(picture.id, picture.picture)}/>
                })}
            </div>
        </div>
    </div>
        }
        </>
    )
}