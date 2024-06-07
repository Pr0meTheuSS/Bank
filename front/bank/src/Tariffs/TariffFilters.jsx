import React, { useState } from 'react';
import { Paper, TextField, Button } from '@mui/material';

const TariffFilters = ({ onSetFilters, applyFilters }) => {
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

  const handleApplyFilters = () => {
    onSetFilters({
      ...filters,
      minAmount: filters.minAmount ? parseFloat(filters.minAmount) : undefined,
      maxAmount: filters.maxAmount ? parseFloat(filters.maxAmount) : undefined,
    });
    applyFilters();
  };

  return (
    <Paper style={{ marginBottom: '20px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <TextField
        label="Название"
        name="name"
        value={filters.name || ''}
        onChange={handleFilterChange}
        style={{ marginBottom: '10px' }}
      />
      <TextField
        label="Мин. Сумма"
        name="minAmount"
        type="number"
        value={filters.minAmount || ''}
        onChange={handleFilterChange}
        style={{ marginBottom: '10px' }}
      />
      <TextField
        label="Макс. Сумма"
        name="maxAmount"
        type="number"
        value={filters.maxAmount || ''}
        onChange={handleFilterChange}
        style={{ marginBottom: '10px' }}
      />
      <Button variant="contained" color="primary" onClick={handleApplyFilters}>
        Применить фильтры
      </Button>
    </Paper>
  );
}

export default TariffFilters;
