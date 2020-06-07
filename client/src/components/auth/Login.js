import React, {Fragment, useState} from 'react'
import {Link} from 'react-router-dom'
const Login = () => {

    const [formData, setFormData]  = useState({
        
        email:'',
        password:''
       
    });

    //desturcture so its easier to use each
    const {email,password} = formData
//gets the name from the form data and only gets the name because for this one thats waht we want
    const onChange =  e => setFormData({...formData, [e.target.name]: e.target.value})

    const onSubmit = async e => {
        e.preventDefault()
        console.log('Success');
        
        
        
        
    }

    return (
        <Fragment>
            <section className="container">
      <h1 className="large text-primary">Login</h1>
      <p className="lead"><i className="fas fa-user"></i>Login in to Devconnect</p>
      <form className="form" onSubmit={e=>onSubmit(e)}>
        <div className="form-group">
          <input type="email" placeholder="Email Address" value={email} 
           onChange={e=> onChange(e)}  name="email" required />
        
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password} 
           onChange={e=> onChange(e)} 
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </section>
        </Fragment>
    )
}

export default Login
