import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

export default function SnackbarC() {
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const handleClick = (newState) => () => {
        setState({ ...newState, open: true });
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    return (
        <Box sx={{ width: 500 }}>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleClose}
                message="Login Successfull"
                key={vertical + horizontal}
            />
        </Box>
    );
}
