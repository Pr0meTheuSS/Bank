import React, { useState } from 'react';
import { Paper, TextField, MenuItem, Button } from '@mui/material';

const UserFilters = ({ onSetFilters, applyFilters }) => {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      if (value === '') {
        const { [name]: _, ...rest } = prevFilters;
        return rest;
      }
      return {
        ...prevFilters,
        [name]: value,
      };
    });
  };

  return (
    <Paper style={{ marginBottom: '20px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <TextField
        label="Имя"
        name="firstName"
        value={filters.firstName || ''}
        onChange={handleFilterChange}
        style={{ marginBottom: '10px' }}
      />
      <TextField
        label="Фамилия"
        name="lastName"
        value={filters.lastName || ''}
        onChange={handleFilterChange}
        style={{ marginBottom: '10px' }}
      />
      <TextField
        label="Email"
        name="email"
        value={filters.email || ''}
        onChange={handleFilterChange}
        style={{ marginBottom: '10px' }}
      />
      <TextField
        label="Пол"
        name="gender"
        value={filters.gender || ''}
        onChange={handleFilterChange}
        select
        style={{ marginBottom: '10px' }}
      >
        <MenuItem value="">Все</MenuItem>
        <MenuItem value="MALE">Мужской</MenuItem>
        <MenuItem value="FEMALE">Женский</MenuItem>
      </TextField>
      <Button variant="contained" color="primary" onClick={() => { onSetFilters(filters); applyFilters(); }}>
        Применить фильтры
      </Button>
    </Paper>
  );
};

export default UserFilters;
