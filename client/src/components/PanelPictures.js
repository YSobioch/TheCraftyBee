import '../stylesheets/panels.css'

export default function PanelPictures() {
    return (
        <>
        <div className="panelHolder">
            <div className='panel'>
                <img src={require('../assets/panels/1.jpg')} className='panel-picture'/>
                <h1 className='panel-text'>Header</h1>
            </div>
            <div className='panel'>
                <img src={require('../assets/panels/2.png')} className='panel-picture'/>
                <h1 className='panel-text'>Header</h1>
            </div>
            <div className='panel'>
                <img src={require('../assets/panels/3.jpg')} className='panel-picture'/>
                <h1 className='panel-text'>Header</h1>
            </div>
        </div>
        <br></br>
        <br></br>
        <div>
            <h1 className='button-group-header'>Bee Kind. Bee Bold. Bee BeYoutiful!</h1>
            
            <div className='comment-container'>
                <div>
                    <p className='panel-paragraph'>Nisi sit justo faucibus nec ornare amet, tortor torquent. Blandit class dapibus.</p>
                    <button className='panel-button'>MY STORY</button>
                </div>
                <div>
                    <p className='panel-paragraph'>Nisi sit justo faucibus nec ornare amet, tortor torquent. Blandit class dapibus.</p>
                    <button className='panel-button'>100% WORRY FREE</button>
                </div>
                <div>
                    <p className='panel-paragraph'>Nisi sit justo faucibus nec ornare amet, tortor torquent. Blandit class dapibus.</p>
                    <button className='panel-button'>SOMETHING FOR EVERYONE</button>
                </div>
            </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <div>
            <h3 className='instagram-header'>Follow Our Instagram</h3>

            <div className="instagram-panelHolder">
            <div className='instagram-panel'>
                <img src={require('../assets/instagram/Instagram1.jpg')} className='panel-picture'/>
            </div>
            <div className='instagram-panel'>
                <img src={require('../assets/instagram/Instagram3.jpg')} className='panel-picture'/>
            </div>
            <div className='instagram-panel'>
                <img src={require('../assets/instagram/Instagram2.jpg')} className='panel-picture'/>
            </div>
            <div className='instagram-panel'>
                <img src={require('../assets/instagram/Instagram4.JPG')} className='panel-picture'/>
            </div>
        </div>
        </div>
        </>
    )
}