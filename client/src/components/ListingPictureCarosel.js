import { useEffect, useState } from "react";
import { ListingPicture } from "./ListingPicture";

import '../stylesheets/listing.css'

export function ListingPictureCarosel(props) {
    const [currentPictureIndex, setCurrentPictureIndex] = useState(0)

    return (
        <div className="listing-picture-carosel">  
            <div className="carosel-selector">
                {props.pictures.map((picture, index) => {
                    return <div key={index} onClick={() => setCurrentPictureIndex(index)}><ListingPicture picture_id={picture.picture_id} class_name={'listing-picture-select'} /></div>
                })}
            </div>
           {props.pictures.map((picture, index) => {
                return (
                    <div className={index === currentPictureIndex ? "picture-display" : "picture-hidden"}>
                        <ListingPicture picture_id={picture.picture_id} class_name={'listing-picture'}/>
                    </div>
                )
           })}
        </div>
    )
}