import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import { useApolloClient } from '@apollo/client';

const CustomAppBar = () => {
  const navigate = useNavigate();
  const client = useApolloClient();

  const handleLogout = async () => {
    // Удаляем токен из локального хранилища
    localStorage.removeItem('token');

    // Сбрасываем кэш Apollo Client
    try {
      await client.resetStore();
    } catch (error) {
      console.error("Ошибка при сбросе кэша:", error);
    }
    navigate('/login');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Банк надёжник
          </Typography>
          <Button color="inherit" component={Link} to="/users">Пользователи</Button>
          <Button color="inherit" component={Link} to="/credits">Кредиты</Button>
          <Button color="inherit" component={Link} to="/credit-tariffs">Кредитные тарифы</Button>
          <Button color="inherit" onClick={handleLogout}>Выйти</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default CustomAppBar;
