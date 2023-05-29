import { connect } from 'react-redux';

import '../stylesheets/signin.css'
import { useState } from 'react';

function SignIn(props) {
    const [errorMessage, setErrorMessage] = useState('hide-error-message')

    const getInfo = async () => {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        
        let res = await fetch(`${process.env.REACT_APP_DOMAIN}/users/${email}/${password}`)
        let user = await res.json()
        if(user.isUser && user.isPassword) {
            setErrorMessage('hide-error-message')
            props.dispatch({
                type: "SIGN_IN",
                user: user.User
            })
            props.toggle()
        } else {
            setErrorMessage('show-error-message')
        }
    }

    return (
        <div className='sign-in-holder'>
            <div className='sign-in-div'>
                <div className='sign-in-container'>
                    <h2>Sign in</h2>
                    <h4 className={errorMessage}>Password or Email is incorrect</h4>                   
                    <form className='sign-in-form'>
                        <label>Email</label>
                        <br></br>
                        <input type='email' id='email'></input>
                        <br></br>
                        <br></br>
                        <label>Password</label>
                        <br></br>
                        <input type='text' id='password'></input>
                        <br></br>
                    </form>
                    <br></br>
                    <button className='sign-in-button' onClick={() => getInfo()}>Sign in</button>
                </div>
                <button className='sign-in-exit-button' onClick={props.toggle}>x</button>
            </div>
            
        </div>  
    )
}

const mapStateToProps = state => ({
    user: state.user
})



export default connect(mapStateToProps)(SignIn)