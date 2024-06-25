import React from 'react';
import { styled } from '@mui/system';
import { Typography } from '@mui/material';

const CapillaryWaveDot = styled('div')(({ theme }) => ({
    position: 'relative',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: 'green', // Green color
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
    '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: '#4CAF50',
        transform: 'translate(-50%, -50%)',
        opacity: 0,
    },
    '&::before': {
        animation: 'wave 2s infinite ease-in-out',
    },
    '&::after': {
        animation: 'wave 2s 1s infinite ease-in-out',
    },
    '@keyframes wave': {
        '0%': {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 0.8,
        },
        '50%': {
            transform: 'translate(-50%, -50%) scale(1.5)',
            opacity: 0,
        },
        '100%': {
            transform: 'translate(-50%, -50%) scale(2)',
            opacity: 0,
        },
    },
}));

const SystemStatus = ({ color }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <CapillaryWaveDot />
        <Typography variant='h6' style={{ marginLeft: '8px', fontWeight: 600, fontSize: '16px', color: color || '#333' }}>System Status</Typography>
    </div>
);

export default SystemStatus;
