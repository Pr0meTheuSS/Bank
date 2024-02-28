import React from 'react';
import './Login.css';
import { FaUser } from "react-icons/fa";

const Login = () => {
  return (
    <div className='wrapper'>
      <form className='login-form'>
        <div className='username-div'>
          <input className='login-form-input' type="text" placeholder='Username'/>
          <FaUser className='fa-user-icon' />
        </div>

        <div className='user-password-div'>
          <input className='login-form-input' type="password" placeholder='Password'/>
        </div>

        <button>Войти</button>

        <a href='#' className='link'>Зарегистрироваться</a>
      </form>
    </div>
  );
};


export default Login;
