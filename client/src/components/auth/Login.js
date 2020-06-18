import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign in</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
      <form className="form" onSubmit={ onSubmit }>
        <div className="form-group">
          <input type="email" placeholder="Email Address" value={ email } name="email" onChange={ onChange } />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" value={ password } name="password" minLength="6" onChange={ onChange } />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">Don't have an account? <Link to='/register'>Sign up</Link></p>
    </Fragment>
  )
}

export default Login;
