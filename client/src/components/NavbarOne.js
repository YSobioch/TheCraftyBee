import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import SignIn from './SignInPoppup'

import '../stylesheets/navbar.css'
import { useState } from 'react'

function NavbarOne(props) {
  const [toggled, setToggled] = useState('primary-navigation flex')
  const [signIn, setSignIn] = useState('sign-in-hide')

  const handleToggle = () => {
    let newClassName = toggled === 'primary-navigation flex' ? 'primary-navigation flex show' : 'primary-navigation flex';
    setToggled(newClassName)
  }

  const handleSignInToggle = () => {
    let newClassName = signIn === 'sign-in-hide' ? 'sign-in' : 'sign-in-hide';
    setSignIn(newClassName);
  }

  return (
    <div className='primary-header'>
      <div className={signIn}>
        <SignIn toggle={handleSignInToggle}/>
      </div>
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
          {props.user ? 
          <li><Link to='/myAccount' className='link-style'>Account</Link></li> :
          <li className='link-style' onClick={handleSignInToggle}>Sign in</li>  
          }
          
        </ul>
      </nav>
    </div>
  )
} 

const mapStateToProps = state => ({ user: state.user })

export default connect(mapStateToProps)(NavbarOne)
