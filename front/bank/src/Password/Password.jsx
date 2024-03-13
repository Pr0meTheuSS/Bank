import React from 'react';
import './Password.css';
import { TextField } from '@mui/material';

const Password = (props) => {
    return (
        <TextField label={props.placeholder} type='password' variant="filled" size="small" sx = {{backgroundColor: '#ccc', borderRadius: '8px', margin:'8px' }}/>
    )
}

export default Password;
