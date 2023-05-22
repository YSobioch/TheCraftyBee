import { useState } from 'react'

import '../stylesheets/carousel.css'

export default function CarouselPictures(props) {
    let pictures = []
    for(let i = 0; i < 6; i++) {
        pictures.push(
        <li>
            <div className='picture-unit'>
                <div className='circle'>
                    <img src={require(`../assets/shop_by/${i + 1}.jpg`)} className='picture'/>
                </div>
                <p className='picture-text'>{'Earring ' + i}</p>
            </div>
        </li>)
    }

    return (
        <ul className='pictureHolder'> 
            {pictures}
        </ul>
    )
}