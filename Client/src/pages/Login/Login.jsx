import React from 'react'
import Header from '../../components/Header'

const Login = () => {
  return (
    <>
    <Header/>
    <div id='logpg'>
    <div id='login'>
        <div className='log-head'>
        <h2 className=' browse-title  '>Welcome<span className='in'> Back</span></h2>
        <p style={{color:'#5a606d'}}>Sign in to your account to continue shopping</p>
   </div>
    <form className='container mx-5 my-5' >
        <div className="mb-3">
          <div className="log-text">Email address</div>
            <input type="email"/>
        </div>
        <div className="mb-3">
          <div className="log-text">Password</div>
          <input type="password"/>
        </div>
        <div>
        <input type="checkbox" style={{color:'#5a606d'}}/> Remember Me
        </div>
        <button type="submit" className="btn btn-orangered signbtn">Sign In</button>
      </form>
 </div>
 </div>
    </>
  )
}
export default Login
