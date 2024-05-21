import React, { useState, useEffect } from 'react';
import { Modal, Paper, Typography, TextField, Button, MenuItem } from '@mui/material';

const CreateTariffModal = ({ open, onClose, tariff = {}, onCreateTariff }) => {
  const [formData, setFormData] = useState(tariff);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(tariff);
  }, [tariff]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Название обязательно';
    if (!formData.minAmount) newErrors.minAmount = 'Мин. сумма обязательна';
    if (!formData.maxAmount) newErrors.maxAmount = 'Макс. сумма обязательна';
    if (!formData.minInterestRate) newErrors.minInterestRate = 'Мин. ставка обязательна';
    if (!formData.maxInterestRate) newErrors.maxInterestRate = 'Макс. ставка обязательна';
    if (!formData.paymentType) newErrors.paymentType = 'Тип платежа обязателен';
    if (!formData.minTermMonth) newErrors.minTermMonth = 'Мин. срок обязателен';
    if (!formData.maxTermMonth) newErrors.maxTermMonth = 'Макс. срок обязателен';
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onCreateTariff(formData);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="tariff-form-modal-title"
      aria-describedby="tariff-form-modal-description"
    >
      <Paper style={{ padding: 20, margin: 20 }}>
        <Typography variant="h6" id="tariff-form-modal-title">
          {tariff.id ? 'Редактирование тарифа' : 'Создание тарифа'}
        </Typography>
        <TextField
          label="Название"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Мин. сумма"
          name="minAmount"
          type="number"
          value={formData.minAmount || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.minAmount}
          helperText={errors.minAmount}
        />
        <TextField
          label="Макс. сумма"
          name="maxAmount"
          type="number"
          value={formData.maxAmount || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.maxAmount}
          helperText={errors.maxAmount}
        />
        <TextField
          label="Мин. ставка"
          name="minInterestRate"
          type="number"
          value={formData.minInterestRate || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.minInterestRate}
          helperText={errors.minInterestRate}
        />
        <TextField
          label="Макс. ставка"
          name="maxInterestRate"
          type="number"
          value={formData.maxInterestRate || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.maxInterestRate}
          helperText={errors.maxInterestRate}
        />
        <TextField
          select
          label="Тип платежа"
          name="paymentType"
          value={formData.paymentType || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.paymentType}
          helperText={errors.paymentType}
        >
          <MenuItem value="Annuity">Аннуитетный</MenuItem>
          <MenuItem value="Diff">Дифференцированный</MenuItem>
        </TextField>
        <TextField
          label="Мин. срок (мес.)"
          name="minTermMonth"
          type="number"
          value={formData.minTermMonth || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.minTermMonth}
          helperText={errors.minTermMonth}
        />
        <TextField
          label="Макс. срок (мес.)"
          name="maxTermMonth"
          type="number"
          value={formData.maxTermMonth || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.maxTermMonth}
          helperText={errors.maxTermMonth}
        />
        <TextField
          label="Описание"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          fullWidth
          error={!!errors.description}
          helperText={errors.description}
        />
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

export default CreateTariffModal;
