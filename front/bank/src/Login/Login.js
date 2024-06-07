import React from 'react';
import './Login.css';
import { useForm } from 'react-hook-form';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import InputWrapperWindow from '../InputWrapperWindow/InputWrapperWindow';
import { TextField, Button, Link, Typography, Box } from '@mui/material';

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
        <TextField 
          placeholder="Введите email" 
          variant="outlined"
          fullWidth
          InputProps={{ style: { color: 'white' } }} 
          InputLabelProps={{ style: { color: 'white' } }}
          required
          {...register('email', { required: 'Email обязателен' })}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ''}
          style={{ marginBottom: '1rem' }}
        />
        <TextField 
          type="password" 
          placeholder="Введите пароль" 
          variant="outlined"
          fullWidth
          InputProps={{ style: { color: 'white' } }} 
          InputLabelProps={{ style: { color: 'white' } }}
          {...register('password', { required: 'Пароль обязателен' })}
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ''}
          style={{ marginBottom: '1rem' }}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Войти
        </Button>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Link href='/forgot-password' color="inherit">
            Восстановить пароль
          </Link>
          <Link href='/signin' color="inherit">
            Зарегистрироваться
          </Link>
        </Box>
      </form>
    </InputWrapperWindow>
  );
};

export default Login;
