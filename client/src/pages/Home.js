import { useState } from 'react';
import Carousel from '../components/Carousel'
import PanelPictures from '../components/PanelPictures';

import '../stylesheets/home.css'

export function Home() {
    let [selector, setSelector] = useState(null);

    return ( 
        <>
        <div className='container'>
        <div className='outerContainer'>
            <div className='rightContainer'>

            </div>
            <div className='leftContainer'>
                <h1>Bee Kind. Bee Bold. Bee BeYoutiful</h1>
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
        <br></br>
        <div className='sign-up'>
            <div className='sign-up-grid'>
                <div>
                    <h1 className='sign-up-header'>Sign Up For Email</h1>
                    <form>
                        <input type='email' placeholder='Email Address' className='alt-font email-form'></input>
                        <input type='submit' value='Submit' className='alt-font submit-button'></input>
                    </form>
                </div>
                <div>
                    <h4>AND UNLOCK 15% OFF</h4>
                </div>
            </div>
        </div>
        </div>

        </>
    )
}