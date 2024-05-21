import React, { useState, useEffect } from 'react';
import { Modal, Paper, Typography, TextField, Button, MenuItem } from '@mui/material';

const CreateUserModal = ({ open, onClose, user = {}, onCreateUser }) => {
  const [formData, setFormData] = useState(user);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'Имя обязательно';
    if (!formData.second_name) newErrors.second_name = 'Отчество обязательно';
    if (!formData.last_name) newErrors.last_name = 'Фамилия обязательна';
    if (!formData.email) newErrors.email = 'Email обязателен';
    if (!formData.password) newErrors.password = 'Пароль обязателен';
    if (!formData.passport_data) newErrors.passport_data = 'Паспортные данные обязательны';
    if (!formData.birth_date) newErrors.birth_date = 'Дата рождения обязательна';
    if (!formData.gender) newErrors.gender = 'Пол обязателен';
    if (!formData.role) newErrors.role = 'Роль обязательна';
    if (!formData.status) newErrors.status = 'Статус обязателен';
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onCreateUser(formData);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="user-form-modal-title"
      aria-describedby="user-form-modal-description"
    >
      <Paper style={{ padding: 20, margin: 20 }}>
        <Typography variant="h6" id="user-form-modal-title">
          {user.ID ? 'Редактирование пользователя' : 'Создание пользователя'}
        </Typography>
        <TextField
          label="Имя"
          name="first_name"
          value={formData.first_name || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.first_name}
          helperText={errors.first_name}
        />
        <TextField
          label="Отчество"
          name="second_name"
          value={formData.second_name || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.second_name}
          helperText={errors.second_name}
        />
        <TextField
          label="Фамилия"
          name="last_name"
          value={formData.last_name || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.last_name}
          helperText={errors.last_name}
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Пароль"
          name="password"
          type="text"
          value={formData.password || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          label="Паспортные данные"
          name="passport_data"
          value={formData.passport_data || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.passport_data}
          helperText={errors.passport_data}
        />
        <TextField
          label="Дата рождения"
          name="birth_date"
          type="date"
          value={formData.birth_date || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.birth_date}
          helperText={errors.birth_date}
        />
        <TextField
          select
          label="Пол"
          name="gender"
          value={formData.gender || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.gender}
          helperText={errors.gender}
        >
          <MenuItem value="MALE">Мужской</MenuItem>
          <MenuItem value="FEMALE">Женский</MenuItem>
        </TextField>
        <TextField
          select
          label="Роль"
          name="role"
          value={formData.role || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.role}
          helperText={errors.role}
        >
          <MenuItem value="ADMIN">Администратор</MenuItem>
          <MenuItem value="EMPLOYEE">Сотрудник</MenuItem>
          <MenuItem value="CLIENT">Клиент</MenuItem>
        </TextField>
        <TextField
          select
          label="Статус"
          name="status"
          value={formData.status || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.status}
          helperText={errors.status}
        >
          <MenuItem value="PENDING">На рассмотрении</MenuItem>
          <MenuItem value="VERIFIED">Подтвержден</MenuItem>
          <MenuItem value="DENIED">Отклонен</MenuItem>
        </TextField>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Сохранить
        </Button>
        <Button onClick={onClose} variant="contained" color="secondary">
          Отмена
        </Button>
      </Paper>
    </Modal>
  );
}

export default CreateUserModal;
