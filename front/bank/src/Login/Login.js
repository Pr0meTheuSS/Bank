import React from 'react';
import './Login.css';
import Username from '../Username/Username';
import Password from '../Password/Password';
import InputWrapperWindow from '../InputWrapperWindow/InputWrapperWindow';
import { Button } from '@mui/material';

const Login = () => {
  return (
    <InputWrapperWindow>
      <form className='login-form'>
        <Username placeholder={"Введите email"}/>
        <Password placeholder={"Введите пароль"}/>

        <button>Войти</button>

        <a href='#' className='link'>Зарегистрироваться</a>
      </form>
    </InputWrapperWindow>
  );
};


export default Login;
