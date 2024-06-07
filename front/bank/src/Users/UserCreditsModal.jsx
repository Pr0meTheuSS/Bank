import React, { useState } from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import {GET_CREDITS} from '../Credits/queries'; // Предполагается, что у вас есть запрос GET_CREDITS
import {ACCEPT_PAYMENT} from '../Credits/mutations'; // Предполагается, что у вас есть мутация ACCEPT_PAYMENT

const UserCreditsModal = ({ open, onClose, userID }) => {
  const { loading, error, data } = useQuery(GET_CREDITS, {
    variables: { limit: 10, offset: 0, filters: { userID } }
  });

  const [acceptPayment] = useMutation(ACCEPT_PAYMENT);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedCredit, setSelectedCredit] = useState(null);

  const handlePaymentSubmit = async () => {
    try {
      const response = await acceptPayment({
        variables: {
          payment: {
            creditID: selectedCredit.id,
            amount: parseInt(paymentAmount, 10)
          }
        }
      });
      console.log('Payment Response:', response.data.acceptPayment);
    } catch (e) {
      console.error('Payment Error:', e);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleRowClick = (credit) => {
    setSelectedCredit(credit);
    setPaymentAmount('');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2">Кредиты пользователя</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Сумма</TableCell>
                <TableCell>Дата выдачи</TableCell>
                <TableCell>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.getCredits.map((credit) => (
                <TableRow key={credit.id} sx={{ bgcolor: credit.isActive ? '#C8E6C9' : 'inherit' }} onClick={() => handleRowClick(credit)}>
                  <TableCell>{credit.id}</TableCell>
                  <TableCell>{credit.body}</TableCell>
                  <TableCell>{credit.startDate}</TableCell>
                  <TableCell>{credit.isActive ? 'Активен' : 'Не активен'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {selectedCredit && (
          <>
            <Typography variant="h6" component="h2" sx={{ mt: 2 }}>График платежей и текущий долг</Typography>
            {/* Здесь можно добавить компонент для отображения графика платежей */}
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Дата платежа</TableCell>
                    <TableCell>Сумма</TableCell>
                    <TableCell>Проценты</TableCell>
                    <TableCell>Штрафы</TableCell>
                    <TableCell>Комиссии</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { selectedCredit.payments && selectedCredit.payments.map((payment) => (
                    <TableRow key={payment.date}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.interest}</TableCell>
                      <TableCell>{payment.penalty}</TableCell>
                      <TableCell>{payment.fee}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2 }}>
              <TextField
                label="Сумма платежа"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                fullWidth
              />
              <Button
                onClick={handlePaymentSubmit}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Отправить
              </Button>
            </Box>
          </>
        )}

        <Button onClick={onClose} variant="contained" color="primary" sx={{ mt: 2 }}>Закрыть</Button>
      </Box>
    </Modal>
  );
};

export default UserCreditsModal;
