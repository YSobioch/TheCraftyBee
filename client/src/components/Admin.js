import { useState, useEffect } from 'react'

import '../stylesheets/navbarTwo.css'
import '../stylesheets/admin.css'


export function Admin() {
    const [pictures, setPictures] = useState([])

    const getPictures = async () => {
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/pictures`)
        let newPictures = await res.json()
        setPictures(newPictures)
    }

    const deletePicture = async (name) => {
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/pictures/deletePicture/${name}`, {
            method: 'DELETE'
        })
        let data = await res.json()
        return data.message
    } 

    const handleClickedOnPicture = async (name) => {
        if(!window.confirm("Delete Picture?")) return
        let res = await deletePicture(name)
        window.alert(res)
    }

    const pictureDeleter = 
    <div className='picture-holder-admin'>
        {pictures.length ? pictures.map((picture, indx) => <img onClick={() => handleClickedOnPicture(picture.picture)} src={`${process.env.REACT_APP_DOMAIN}/pictures/${picture.id}`} key={indx}/>) : <></>}
    </div>

    useEffect(() => {
        getPictures()
    }, [])

    return (
        <div >
            <nav className='nav-two-background'>
                <ul className="navigation">
                <li>Pictures</li>
                <li>Codes</li>
                <li>Newsletters</li>
                </ul>
            </nav>
            {pictureDeleter}
        </div>
    )
}