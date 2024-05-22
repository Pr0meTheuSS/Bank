import React, { useState, useEffect } from 'react';
import { Paper, TextField, MenuItem, Button } from '@mui/material';

const CreditFilters = ({ filters, setFilters, applyFilters }) => {
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => {
            if (value === '') {
                const { [name]: _, ...rest } = prevFilters;
                return rest;
            }
            return {
                ...prevFilters,
                [name]: value
            };
        });
    };

    return (
        <Paper style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', color: 'white' }}>
            <TextField
                label="ID пользователя"
                name="userID"
                value={filters.userID}
                onChange={handleFilterChange}
                style={{ marginBottom: '10px' }}
            />
            <TextField
                label="Активен"
                name="isActive"
                value={filters.isActive}
                onChange={handleFilterChange}
                style={{ marginBottom: '10px' }}
                select
            >
                <MenuItem value="">Все</MenuItem>
                <MenuItem value={true}>Да</MenuItem>
                <MenuItem value={false}>Нет</MenuItem>
            </TextField>
            <TextField
                label="Минимальная сумма"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleFilterChange}
                type="number"
                style={{ marginBottom: '10px' }}
            />
            <TextField
                label="Максимальная сумма"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                type="number"
                style={{ marginBottom: '10px' }}
            />
            <TextField
                label="Дата начала"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                type="date"
                style={{ marginBottom: '10px' }}
            />
            <TextField
                label="Дата окончания"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                type="date"
                style={{ marginBottom: '10px' }}
            />
            <Button variant="contained" color="primary" onClick={applyFilters}>Применить фильтры</Button>
        </Paper>
    );
};

export default CreditFilters;
