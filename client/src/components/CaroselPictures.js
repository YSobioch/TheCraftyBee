import { useEffect, useState } from 'react'

import '../stylesheets/carousel.css'
import { Link } from 'react-router-dom'

export default function CarouselPictures(props) {
    let [collections, setCollections] = useState([{name: "loading"}])

    const getCollections = async () => {
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/collections`)
        let collectionList = await res.json()
        setCollections(collectionList)
    } 

    let pictures = []
    for(let i = 0; i < collections.length; i++) {
        if(collections[i].name !== "loading") {
            pictures.push(
                <li>
                    <Link className='unit-link' to={`/store/${collections[i].id}`}>
                    <div className='picture-unit'>
                        <div className='circle'>
                            <img src={`${process.env.REACT_APP_DOMAIN}/pictures/${collections[i].picture}`} className='picture'/>
                        </div>
                        <p className='picture-text'>{collections[i].name}</p>
                    </div>
                    </Link >
                </li>)
        }
    }

    useEffect(() => {
        getCollections()
    }, [])

    return (
        <ul className='pictureHolder'> 
            {pictures}
        </ul>
    )
}