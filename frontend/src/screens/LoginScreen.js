import React from 'react';
import { Container, Box, Avatar, Typography, TextField, Button, Grid, Link, Snackbar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { SnackbarContent } from '@mui/material';
const SnackBarC = ({ openSnackBar, handleCloseSnackBar }) => {
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={openSnackBar}
            onClose={handleCloseSnackBar}
            key={'top' + 'center'}
        >
            <SnackbarContent
                sx={{
                    backgroundColor: 'white',
                    color: 'black',
                }}
                message={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ mr: 1, color: 'green' }} />
                        <span>Login Successful</span>
                    </Box>
                }
            />
        </Snackbar>
    );
}

export function LoginScreen() {
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const handleClick = () => {
        setOpenSnackBar(true);
        setTimeout(() => {
            navigate('/dashboard');
        }, 1500); // Navigate after the snackbar is shown
    }

    const handleCloseSnackBar = () => {
        setOpenSnackBar(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleClick}
                    >
                        Sign In
                    </Button>
                    <SnackBarC openSnackBar={openSnackBar} handleCloseSnackBar={handleCloseSnackBar} />
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
