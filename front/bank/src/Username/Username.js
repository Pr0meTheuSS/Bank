import React from 'react';
import { TextField } from '@mui/material';
import './Username.css';

const Username = (props) => {
    return (
        <TextField label={props.placeholder} variant="filled" size="small" sx = {{backgroundColor: '#ccc', borderRadius: '8px', margin:'8px'}}/>
    )
}

export default Username;
