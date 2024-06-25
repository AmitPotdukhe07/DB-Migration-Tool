import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Grid } from '@mui/material';
import SystemStatus from './SystemStatus';

function ResponsiveAppBar() {

    return (
        <AppBar position="static" sx={{ bgcolor: '#fefaf5' }}>
            <Container >
                <Toolbar disableGutters>
                    <Box
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'black',
                        }}
                    >
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <img src="/Crave-dark-logo.webp" alt="logo" style={{ height: '40px', marginRight: '10px' }} />
                            </Grid>
                            <Grid item>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.1rem',
                                    }}
                                >
                                    Migration Tool
                                </Typography>
                            </Grid>

                        </Grid>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    <span
                        variant="h6"
                        style={{
                            fontFamily: 'cursive',
                            fontWeight: 200,
                            color: 'black',
                        }}
                    >
                        <img src="/heart.png" alt="" style={{ height: '9px' }} />
                        CAPM
                    </span>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
