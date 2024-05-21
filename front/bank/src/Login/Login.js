import React from 'react';
import './Login.css';
import { useForm } from 'react-hook-form';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import InputWrapperWindow from '../InputWrapperWindow/InputWrapperWindow';
import { TextField } from '@mui/material';

const LOGIN_USER = gql`
  mutation LoginUser($loginRequest: LoginRequest!) {
    login(input: $loginRequest) {
      token
    }
  }
`;

const Login = () => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const [loginUser] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const onSubmit = data => {
    const loginRequest = {
      email: getValues("email"),
      password: getValues("password")
    };
    alert(data.email);
    loginUser({ variables: { loginRequest } })
      .then(response => {
        // Получаем токен из ответа
        const token = response.data.login.token;
        // Сохраняем токен в локальное хранилище
        localStorage.setItem('token', token);
        // Переходим на главную страницу
        navigate('/');
      })
      .catch(error => {
        console.error('Login error:', error);
        alert('Login error:' + error);
        // Обработка ошибки входа
      });
  };

  return (
    <InputWrapperWindow>
      <form className='login-form' onSubmit={handleSubmit(onSubmit)}>
        <TextField placeholder={"Введите email"}  required={true} {...register('email')} />
        <TextField type="password" error={errors.password} helperText={errors.password && "Пароль обязателен"} {...register('password')} />

        <button type="submit">Войти</button>

        <a href='/signin' className='link'>Зарегистрироваться</a>
      </form>
    </InputWrapperWindow>
  );
};

export default Login;
