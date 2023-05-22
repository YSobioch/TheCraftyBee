import { useState } from 'react';
import Carousel from '../components/Carousel'
import PanelPictures from '../components/PanelPictures';

import '../stylesheets/home.css'

export function Home() {
    let [selector, setSelector] = useState(null);

    return ( 
        <div className='container'>
        <div className='outerContainer'>
            <div className='rightContainer'>

            </div>
            <div className='leftContainer'>
                <h1>ALLOW YOURSELF TO "BEE" HAPPY</h1>
                <h4 className='alt-font'>"A Crafty Bee is a Happy Bee!"</h4>
                <button className='btn'>Browse</button>
            </div>
        </div>
        <br></br>
        <br></br>
        <div>
            <Carousel />
        </div>
        <br></br>
        <div>
            <PanelPictures />
        </div>
        </div>
    )
}