import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import SystemStatus from "./SystemStatus";

const Footer = () => {
    return (
        <Box
            sx={{
                width: "100%",
                color: 'white',
                backgroundColor: "#1a1a1a",
                paddingTop: "1rem",
                marginBottom: 0,
                paddingBottom: "1rem",
            }}
        >
            <Container>
                <Grid container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center">
                    <Grid item>
                        <img src="https://www.craveinfotech.com/wp-content/uploads/2021/12/Crave-light-logo.png" alt="" style={{ height: '10vh', width: '11vw', color: 'white' }} />
                    </Grid>
                    <Grid direction="column" alignItems="center">
                        <Grid item xs={12}>
                            <span>© Copyright Crave InfoTech 2024. All Rights Reserved.</span>
                            <br />
                        </Grid>
                        <Grid item xs={12}>

                            <Typography color="white" variant="subtitle1">
                                On-Premise to Cloud Database Migration
                            </Typography>
                        </Grid>
                        <span style={{ fontSize: '19px' }}>© Developed and maintained by Amit</span>
                    </Grid>
                    <Grid item>
                        <Typography color="white" variant="h5">
                            jaGGyjack
                        </Typography>
                        <SystemStatus color="white" />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Footer