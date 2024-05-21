import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   title: {
//     flexGrow: 1,
//   },
// }));

const CustomAppBar = () => {
//   const classes = useStyles();

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Банк надёжник
          </Typography>
          <Button color="inherit" component={Link} to="/profile">Профиль</Button>
          <Button color="inherit" component={Link} to="/users">Пользователи</Button>
          <Button color="inherit" component={Link} to="/credits">Кредиты</Button>
          <Button color="inherit" component={Link} to="/credit-applications">Заявки на кредит</Button>
          <Button color="inherit" component={Link} to="/credit-tariffs">Кредитные тарифы</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default CustomAppBar;
