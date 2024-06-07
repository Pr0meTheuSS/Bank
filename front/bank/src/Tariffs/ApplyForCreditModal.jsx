import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { useMutation, gql } from '@apollo/client';

const CREATE_APPLICATION = gql`
  mutation createApplication($input: ApplicationInput!) {
    createApplication(input: $input) {
      status
    }
  }
`;

const ApplyForCreditModal = ({ open, onClose, tariff }) => {
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [error, setError] = useState(null);

  const [createApplication] = useMutation(CREATE_APPLICATION);

  const handleSubmit = async () => {
    if (!amount || !term) {
      setError('Пожалуйста, заполните все поля.');
      return;
    }

    if (parseInt(amount) < tariff.minAmount || parseInt(amount) > tariff.maxAmount) {
      setError(`Сумма должна быть в диапазоне от ${tariff.minAmount} до ${tariff.maxAmount}.`);
      return;
    }

    if (parseInt(term) < tariff.minTermMonth || parseInt(term) > tariff.maxTermMonth) {
      setError(`Срок должен быть в диапазоне от ${tariff.minTermMonth} до ${tariff.maxTermMonth} месяцев.`);
      return;
    }

    try {
      await createApplication({
        variables: {
          input: {
            tariffID: tariff.id,
            amount: parseInt(amount),
            term: parseInt(term)
          }
        }
      });
      onClose();
    } catch (error) {
      console.error('Error applying for credit:', error);
      setError('Произошла ошибка при отправке заявки.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2">Направить заявку на кредитный тариф</Typography>
        <TextField
          label="Сумма"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          label="Срок (месяцы)"
          type="number"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 2 }}>Отправить заявку</Button>
        <Button onClick={onClose} variant="contained" color="secondary" sx={{ mt: 2, ml: 2 }}>Отмена</Button>
      </Box>
    </Modal>
  );
};

export default ApplyForCreditModal;
