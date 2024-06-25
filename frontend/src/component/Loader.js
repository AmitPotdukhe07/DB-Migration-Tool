import * as React from 'react';
import Box from '@mui/material/Box';
import ReactLoading from 'https://cdn.skypack.dev/react-loading@2.0.3';
import { Grid } from '@mui/material';

function PreLoader1() {
    return (
        <ReactLoading
            type={"bars"}
            color={"#ce93d8"}
            height={80}
            width={100}
        />
    );
}

export default function Loader() {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                zIndex: 1300
            }}
        >
            <Grid container justifyContent='center' alignItems='center'>
                <Box sx={{ textAlign: 'center' }}>
                    <PreLoader1 />
                    <div>Loading...</div>
                </Box>
            </Grid>
        </Box>
    );
}
