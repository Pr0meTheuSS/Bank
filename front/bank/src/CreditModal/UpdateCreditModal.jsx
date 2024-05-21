import React, { useState, useEffect } from 'react';
import { Modal, Paper, Typography, TextField, Button, MenuItem } from '@mui/material';
import { format } from 'date-fns';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd');
};

const EditCreditModal = ({ open, onClose, credit = {}, onUpdateCredit }) => {
    const [formData, setFormData] = useState({
        ...credit,
        startDate: credit.startDate ? formatDate(credit.startDate) : '',
        endDate: credit.endDate ? formatDate(credit.endDate) : ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData({
            ...credit,
            startDate: credit.startDate ? formatDate(credit.startDate) : '',
            endDate: credit.endDate ? formatDate(credit.endDate) : ''
        });
    }, [credit]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.userID) newErrors.userID = 'ID пользователя обязательно';
        if (!formData.applicationID) newErrors.applicationID = 'ID кредитной заявки обязательно';
        if (!formData.body) newErrors.body = 'Сумма обязательна';
        if (!formData.percents) newErrors.percents = 'Проценты обязательны';
        if (!formData.fine) newErrors.fine = 'Штрафы обязательны';
        if (!formData.commission) newErrors.commission = 'Комиссия обязательна';
        if (formData.isActive === undefined) newErrors.isActive = 'Активен обязателен';
        if (!formData.paymentType) newErrors.paymentType = 'Тип платежа обязателен';
        if (!formData.interestRate) newErrors.interestRate = 'Процентная ставка обязательна';
        if (!formData.loanTermMonths) newErrors.loanTermMonths = 'Срок кредита обязателен';
        if (!formData.startDate) newErrors.startDate = 'Дата начала обязательна';
        return newErrors;
    };

    const handleSubmit = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onUpdateCredit(formData);
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="credit-form-modal-title"
            aria-describedby="credit-form-modal-description"
        >
            <Paper style={{ padding: 20, margin: 20 }}>
                <Typography variant="h6" id="credit-form-modal-title">
                    Редактирование кредита
                </Typography>
                <TextField
                    label="ID пользователя"
                    name="userID"
                    value={formData.userID || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.userID}
                    helperText={errors.userID}
                />
                <TextField
                    label="ID кредитной заявки"
                    name="applicationID"
                    value={formData.applicationID || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.applicationID}
                    helperText={errors.applicationID}
                />
                <TextField
                    label="Сумма (руб.)"
                    name="body"
                    type="number"
                    value={formData.body || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.body}
                    helperText={errors.body}
                />
                <TextField
                    label="Проценты (руб.)"
                    name="percents"
                    type="number"
                    value={formData.percents || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.percents}
                    helperText={errors.percents}
                />
                <TextField
                    label="Штрафы (руб.)"
                    name="fine"
                    type="number"
                    value={formData.fine || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.fine}
                    helperText={errors.fine}
                />
                <TextField
                    label="Комиссия (руб.)"
                    name="commission"
                    type="number"
                    value={formData.commission || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.commission}
                    helperText={errors.commission}
                />
                <TextField
                    select
                    label="Активен"
                    name="isActive"
                    value={formData.isActive || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.isActive}
                    helperText={errors.isActive}
                >
                    <MenuItem value={true}>Да</MenuItem>
                    <MenuItem value={false}>Нет</MenuItem>
                </TextField>
                <TextField
                    label="Тип платежа"
                    name="paymentType"
                    value={formData.paymentType || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.paymentType}
                    helperText={errors.paymentType}
                />
                <TextField
                    label="Процентная ставка"
                    name="interestRate"
                    type="number"
                    value={formData.interestRate || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.interestRate}
                    helperText={errors.interestRate}
                />
                <TextField
                    label="Срок кредита (месяцы)"
                    name="loanTermMonths"
                    type="number"
                    value={formData.loanTermMonths || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.loanTermMonths}
                    helperText={errors.loanTermMonths}
                />
                <TextField
                    label="Дата начала"
                    name="startDate"
                    type="date"
                    value={formData.startDate || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                />
                <TextField
                    label="Дата окончания"
                    name="endDate"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.endDate}
                    helperText={errors.endDate}
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
};

export default EditCreditModal;