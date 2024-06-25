import React, { useEffect, useState } from 'react';
import customAxios from '../axios';
import Swal from 'sweetalert2';
import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Typography, List, ListItem, ListItemButton, ListItemText, Collapse, OutlinedInput, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import JsonDisplay from './JsonDisplay';
import SqlCodeSnippet from './SqlCodeSnippet';
import Loader from './Loader';

const ProcedureList = ({ procedures, handleDelete }) => {
    const [selectedProcedure, setSelectedProcedure] = useState(null);

    const handleListItemClick = (index) => {
        setSelectedProcedure(selectedProcedure === index ? null : index);
    };

    return (
        <List>
            {procedures.map((procedure, index) => (
                <React.Fragment key={procedure.PROCEDURE_OID}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleListItemClick(index)}>
                            <ListItemText primary={procedure.PROCEDURE_NAME} />
                        </ListItemButton>
                        <IconButton onClick={() => handleDelete(procedure.PROCEDURE_OID)} edge="end" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                    <Collapse in={selectedProcedure === index} timeout="auto" unmountOnExit>
                        <Box sx={{ padding: 2 }}>
                            <Typography variant="body1">{procedure.DEFINITION}</Typography>
                        </Box>
                    </Collapse>
                </React.Fragment>
            ))}
        </List>
    );
};

export const ShowProcedures = () => {
    const [procedures, setProcedures] = useState([]);
    const [showJson, setShowJson] = useState(false);
    const [defination, setDefination] = useState([]);
    const [loader, setLoader] = useState(false);
    const [procedureList, setProcedureList] = useState([]);
    const [selectedProcedures, setSelectedProcedures] = useState([]);
    const [procedureName, setProcedureName] = useState([]);

    useEffect(() => {
        setLoader(true)
        customAxios.get("/get-procedures")
            .then((response) => {
                setLoader(false)

                if (response.data.success) {
                    setProcedures(response.data.procedures);
                    setProcedureName(response.data.procedure);
                } else {
                    setLoader(false)
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Failed : ${response.data.msg}`,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            })
            .catch((err) => {
                setLoader(false)
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `${err}`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            });
    }, []);

    const handleDelete = (procedureOid) => {
        setProcedures(procedures.filter(procedure => procedure.PROCEDURE_OID !== procedureOid));
        setProcedureName(procedureName.filter(name => name !== procedureOid));
    };

    const handleSelectChange = (event) => {
        setSelectedProcedures(event.target.value);
    };

    const handleChange = (event) => {
        const { target: { value } } = event;
        setSelectedProcedures(typeof value === 'string' ? value.split(',') : value);

        const def = procedures.find((item) => item.PROCEDURE_NAME === value[value.length - 1]);

        if (def) {
            console.log("new pro : ", def, value);
            setDefination([...defination, def.DEFINITION]);
        }
    };


    const ITEM_HEIGHT = 90;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 450,
            },
        },
    };

    return (
        <>
            <Grid container justifyContent="center" alignItems="flex-start" spacing={2}>
                <Grid item>
                    <FormControl sx={{ m: 1, width: 400 }}>
                        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={selectedProcedures}
                            onChange={handleChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {procedureName.map((table) => (
                                <MenuItem key={table} value={table}>
                                    <Checkbox checked={selectedProcedures.indexOf(table) > -1} />
                                    <ListItemText primary={table} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {loader && <Loader />}

                <Grid item >
                    {selectedProcedures.map((item) => (
                        <Box key={item.PROCEDURE_NAME} display="flex" alignItems="center" sx={{ mb: 1 }}>
                            <Button
                                variant="contained"
                                sx={{ flexGrow: 1, fontSize: '13px', width: 290, justifyContent: 'flex-start' }}
                            >
                                {item}
                            </Button>
                            <IconButton onClick={() => handleDelete(item.PROCEDURE_OID)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Grid>
            </Grid>
            <Button onClick={() => {
                setShowJson(!showJson)
            }}>Get Defination</Button>
            {
                showJson && <SqlCodeSnippet sqlQueries={defination} />
            }
        </>
    );
};
