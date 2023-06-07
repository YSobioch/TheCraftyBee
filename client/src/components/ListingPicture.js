import { useState, useEffect } from 'react'

import '../stylesheets/listing.css'

export function ListingPicture(props) {
    const [listingPicture, setListingPicture] = useState(null)

    const getPicture = async () => {
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/pictures/${props.picture_id}`)
        let imageBlob = await res.blob()
        let imageObjectURL = URL.createObjectURL(imageBlob)
        setListingPicture(imageObjectURL)
    }

    useEffect(() => {
        getPicture()
    }, [])
    
    return <img key={props.thiskey} src={listingPicture} className={props.class_name}/>
}
