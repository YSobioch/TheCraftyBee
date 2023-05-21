import { Link } from 'react-router-dom'
import '../stylesheets/navbar.css'
import { useState } from 'react'

export function NavbarOne() {
  const [toggled, setToggled] = useState('primary-navigation flex')

  const handleToggle = () => {
    let newClassName = toggled === 'primary-navigation flex' ? 'primary-navigation flex show' : 'primary-navigation flex';
    setToggled(newClassName)
  }

  return (
    <div className='primary-header'>
      <div className='site-title-mobile'><Link to="/" className='title-style'>The Crafty Bee</Link></div>
      <button className='mobile-nav-toggle' onClick={handleToggle}
      aria-controls='primary-navigation' aria-expanded="false">
        <span className='sr-only'>Menu</span></button>

      <nav>
        <ul id="primary-navigation" className={toggled}>
          <li className='active'><Link to="/" onClick={handleToggle} className='link-style'>Home</Link></li>
          <li><Link to="/store" onClick={handleToggle} className='link-style'>Shop</Link></li>
          <li className='site-title'></li>
          <li className='site-title'></li>
          <li className='site-title'><Link to="/" className='title-style'>The Crafty Bee</Link></li>
          <li className='site-title'></li>
          <li className='site-title'></li>
          <li><Link to="/myCart" onClick={handleToggle} className='link-style'>Cart</Link></li>
          <li><Link to="/myAccount" onClick={handleToggle} className='link-style'>Account</Link></li>
        </ul>
      </nav>
    </div>
  )
} 
