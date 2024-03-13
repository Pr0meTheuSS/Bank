import React from 'react';
import Header from '../Header/Header';
import InputWrapperWindow from '../InputWrapperWindow/InputWrapperWindow';
import Username from '../Username/Username';
import Password from '../Password/Password';
import { Button } from '@mui/material';

const Signin = () => {
    return (
        <>
            <Header />
            <InputWrapperWindow>
                <Username placeholder={'Введите email'}/>
                <Password placeholder={'Введите пароль'}/>
                <Password placeholder={'Повторите пароль'}/>
                <Button variant="contained" sx={{bgcolor: '#333'}}>Регистрация</Button>
            </InputWrapperWindow>
        </>
    )
}

export default Signin;
