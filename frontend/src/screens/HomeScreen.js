import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import { DataGrid } from '@mui/x-data-grid';
import Select from '@mui/material/Select';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import StepLabel from '@mui/material/StepLabel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SelectDatabase from '../component/SelectDatabase';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Swal from "sweetalert2";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import DeleteIcon from '@mui/icons-material/Delete';
import StorageIcon from '@mui/icons-material/Storage';
import ListItemText from '@mui/material/ListItemText';
import axios from "../axios"
import Checkbox from '@mui/material/Checkbox';
import { Container, Grid, IconButton } from '@mui/material';
import Loader from '../component/Loader';
import JsonDisplay from '../component/JsonDisplay';
import CircularLoader from '../component/CircularLoader';
import { ShowProcedures } from '../component/ShowProcedures';
import SystemStatus from '../component/SystemStatus';
import { ShowFunctions } from '../component/ShowFunctions';
import { ShowViews } from '../component/ShowViews';

const steps = ['Select Database', 'Select tables', 'Fetch tables & download .csv'];

const DisplayData = ({ tables, setShowLoader }) => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState({}); // Step 1: State for individual table loading

    const convertToCSV = (data) => {
        const keys = Object.keys(data[0]);
        const csvRows = [keys.join(','), ...data.map(row => keys.map(key => row[key]).join(','))];
        return csvRows.join('\n');
    };

    const handleDownload = () => {
        const csv = convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUpload = async (tableName, data) => {
        setLoading(prev => ({ ...prev, [tableName]: true }));
        try {
            const response = await axios.post("/insert-data", { tableName: tableName, dataArray: data });
            if (response.data.success) {
                setLoading(prev => ({ ...prev, [tableName]: false }));
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `Data migrated successfully for ${tableName}`,
                    showConfirmButton: false,
                    timer: 2500,
                });
            } else {
                setLoading(prev => ({ ...prev, [tableName]: false }));
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `Failed : ${response.data.msg}`,
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        } catch (error) {
            setLoading(prev => ({ ...prev, [tableName]: false })); // Stop loading
            Swal.fire({
                position: "center",
                icon: "error",
                title: `Failed : ${error.message}`,
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    React.useEffect(() => {
        setShowLoader(true)
        const fetchData = async () => {
            try {
                const response = await axios.post("/fetch-tables", { tables });
                if (response.data.success) {
                    setData(response.data.data);
                    setShowLoader(false)
                } else {
                    setShowLoader(false)
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Failed : ${response.data.msg}`,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            } catch (err) {
                setShowLoader(false)
                if (axios.isCancel(err)) {
                    console.log('Request canceled', err.message);
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Internal server error`,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            }
        };

        fetchData();
    }, [tables]);

    const getColumns = (rows) => {
        if (rows.length === 0) return [];
        return Object.keys(rows[0]).map((key) => ({
            field: key,
            headerName: key.charAt(0).toUpperCase() + key.slice(1),
            width: 150,
        }));
    };

    return (
        <Container>
            {data.map((tableData, index) => (
                <Box key={index} mb={4}>
                    <Grid container justifyContent='space-between' sx={{ marginBottom: '10px' }}>
                        <Typography variant="h6" gutterBottom>
                            {tableData.table}
                        </Typography>
                        <Button onClick={handleDownload} size='small' variant='outlined' startIcon={<FileDownloadIcon />}>Download</Button>
                        <Button
                            variant='contained'
                            onClick={() => handleUpload(tableData.table, tableData.rows)}
                            disabled={loading[tableData.table]} // Disable button when loading
                            endIcon={<CloudUploadIcon />}
                        >
                            {loading[tableData.table] && <CircularLoader />}
                            Upload
                        </Button>

                    </Grid>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={tableData.rows.map((row, id) => ({ id, ...row }))}
                            columns={getColumns(tableData.rows)}
                            pageSize={8}
                            rowsPerPageOptions={[5, 10, 20]}
                            componentsProps={{
                                row: {
                                    style: { padding: '0 8px', height: 'auto', wordWrap: 'break-word' },
                                },
                                cell: {
                                    style: { padding: '0 8px', height: 'auto', whiteSpace: 'normal' },
                                },
                                columnHeaders: {
                                    style: { height: 'auto', minHeight: '32px' },
                                },
                                pagination: {
                                    style: { height: '40px', minHeight: '40px' },
                                },
                            }}
                            sx={{
                                '& .MuiDataGrid-cell': {
                                    whiteSpace: 'normal !important',
                                    lineHeight: '1.5 !important',
                                    wordWrap: 'break-word !important',
                                },
                            }}
                        />
                    </div>
                </Box>
            ))}
        </Container>
    );
};


const SelectTables = ({ tables, setTables, setShowLoader, circularLoader, setCircularLoader }) => {
    const [tableData, setTableData] = React.useState([]);
    const [tableJson, setTableJson] = React.useState([]);
    const [dbObject, setDbObject] = React.useState('');
    const [showJson, setShowJson] = React.useState(false);

    React.useEffect(() => {
        setShowLoader(true)
        axios.post("/get-tables", { dbName: "CRAVE_ACCOUNTS_LIVE" })
            .then((response) => {
                if (response.data.success) {
                    setTableData(response.data.tables);
                    setShowLoader(false)
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Failed : ${response.data.msg}`,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    setShowLoader(false)
                }
            })
            .catch((err) => {
                setShowLoader(false)
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `Internal server error`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            });
    }, []);

    const getTableJson = (tables) => {
        try {
            setCircularLoader(true)
            axios.post("/get-table-schema", { tables: tables })
                .then((response) => {
                    if (response.data.success) {
                        setTableJson(response.data.response)
                        setShowJson(true)
                        setCircularLoader(false)
                    } else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: `Failed : ${response.data.msg}`,
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        setShowLoader(false)
                        setCircularLoader(false)
                    }
                })
                .catch((err) => {
                    setShowLoader(false)
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Internal server error`,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    setCircularLoader(false)

                });
        } catch (error) {
            console.log(error);
        }
    }

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

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setTables(typeof value === 'string' ? value.split(',') : value);
    };

    const handleDelete = (tableToDelete) => {
        setTables((prevTables) => prevTables.filter((table) => table !== tableToDelete));
    };

    const handleDbObjectChange = (event) => {
        setDbObject(event.target.value);
    };

    const TableView = () => {
        return <>
            <Grid container justifyContent="center" alignItems="flex-start" spacing={2}>
                <Grid item>
                    <FormControl sx={{ m: 1, width: 400 }}>
                        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={tables}
                            onChange={handleChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {tableData.map((table) => (
                                <MenuItem key={table.TABLE_NAME} value={table.TABLE_NAME}>
                                    <Checkbox checked={tables.indexOf(table.TABLE_NAME) > -1} />
                                    <ListItemText primary={table.TABLE_NAME} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item >
                    {tables.map((table) => (
                        <Box key={table} display="flex" alignItems="center" sx={{ mb: 1 }}>
                            <Button
                                startIcon={<StorageIcon />}
                                variant="contained"
                                sx={{ flexGrow: 1, fontSize: '13px', width: 290, justifyContent: 'flex-start' }}
                            >
                                {table}
                            </Button>
                            <IconButton onClick={() => handleDelete(table)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Grid>
            </Grid>
            <Grid container direction='column'>
                <Button onClick={() => getTableJson(tables)} variant='outlined' sx={{ width: '10rem' }} >{circularLoader && <CircularLoader />} Get schema</Button>
                {
                    showJson && <JsonDisplay jsonData={tableJson} />
                }
            </Grid>
        </>
    }

    return (
        <Grid container justifyContent="center" alignItems='center'>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Select object</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={dbObject}
                    onChange={handleDbObjectChange}
                    label="Age"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={1}>Tables</MenuItem>
                    <MenuItem value={2}>Procedures</MenuItem>
                    <MenuItem value={3}>Functions</MenuItem>
                    <MenuItem value={4}>Views</MenuItem>
                </Select>
            </FormControl>

            {
                dbObject === 1 ? <TableView /> : (dbObject === 2 ? <ShowProcedures /> : (dbObject === 3 ? <ShowFunctions /> : (dbObject === 4 ? <ShowViews /> : null)))
            }


        </Grid>
    );
};

export default function HomeScreen() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [showLoader, setShowLoader] = React.useState(false);
    const [skipped, setSkipped] = React.useState(new Set());
    const [tables, setTables] = React.useState([]);
    const [circularLoader, setCircularLoader] = React.useState(false)

    const isStepOptional = (step) => {
        return step === -1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const CustomStepIcon = (props) => {
        const { active, completed, className } = props;

        if (completed) {
            return <CheckCircleOutlineOutlinedIcon className={className} sx={{ color: 'white', backgroundColor: 'orange' }} />;
        } else if (active) {
            return <CheckCircleOutlineOutlinedIcon className={className} sx={{ color: 'orange' }} />;
        } else {
            return <CheckCircleOutlineOutlinedIcon className={className} sx={{ color: 'gray' }} />;
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <Typography variant="caption">Optional</Typography>
                        );
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps} >{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <Grid container justifyContent="flex-end">

            </Grid>
            {showLoader && <Loader />}

            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                    <Grid container >
                        <>
                            {activeStep === 0 ? <SelectDatabase /> : activeStep === 1 ? <SelectTables tables={tables} setShowLoader={setShowLoader} setTables={setTables} circularLoader={circularLoader} setCircularLoader={setCircularLoader} /> : activeStep === 2 ? <DisplayData tables={tables} setShowLoader={setShowLoader} /> : "In Progress"}
                        </>

                        <Grid container justifyContent="space-between" sx={{ mb: 20 }}>
                            <Button
                                color="warning"
                                variant="contained"
                                startIcon={<ArrowBackIosIcon />}
                                disabled={activeStep === 0}
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                            <Button onClick={handleNext} color="success"
                                endIcon={activeStep === steps.length - 1 ? '' : <NavigateNextIcon />}
                                variant="contained">
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </Grid>

                    </Grid>
                </React.Fragment>
            )}

        </Box>
    );
}
