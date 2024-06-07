import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Alert, Typography } from '@mui/material';
import {useNavigate} from 'react-router-dom';

const RESET_PASSWORD = gql`
  mutation recoveryPassword($email: String!) {
    recoveryPassword(email: $email) {
      status
    }
  }
`;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [resetPassword, { data, loading, error }] = useMutation(RESET_PASSWORD);
  const [successMessage, setSuccessMessage] = useState(null);

  const onSubmit = (data) => {
    resetPassword({ variables: { email: data.email } })
      .then(response => {
        setSuccessMessage(response.data.resetPassword.message);
        navigate("/login");
      })
      .catch(err => {
        console.error('Password reset error:', err);
      });
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Восстановление пароля
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Введите email"
          variant="outlined"
          fullWidth
          {...register('email', { required: 'Email обязателен', pattern: { value: /^\S+@\S+$/i, message: 'Неверный формат email' } })}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ''}
          style={{ marginBottom: '1rem' }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          Отправить
        </Button>
        {loading && <Typography>Загрузка...</Typography>}
        {error && <Alert severity="error" style={{ marginTop: '1rem' }}>Ошибка: {error.message}</Alert>}
        {successMessage && <Alert severity="success" style={{ marginTop: '1rem' }}>{successMessage}</Alert>}
      </form>
    </Container>
  );
};

export default ForgotPassword;
