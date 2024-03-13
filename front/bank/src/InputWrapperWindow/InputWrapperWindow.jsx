import React from "react";
import './InputWrapperWindow.css';
import Box from '@mui/material/Box';

const InputWrapperWindow = ({children}) => {
    // return <div className='wrapper'>{children}</div>
    return  (
        <Box component="section"      
        my={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        margin={1}
        sx={{ p: 2, bgcolor: 'rgba(83, 83, 83, .5)', borderRadius: '8px'}}>            
                {children}
        </Box>
    )
}

export default InputWrapperWindow;