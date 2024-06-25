import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import axios from "../axios"
import SqlCodeSnippet from './SqlCodeSnippet';

const JsonDisplay = ({ jsonData }) => {
    const [copySuccess, setCopySuccess] = useState(false);
    const [showSql, setShowSql] = useState(false);
    const [queries, setQueries] = useState([])

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(jsonData))
            .then(() => setCopySuccess(true))
            .catch((err) => console.error('Error copying: ', err));
    };

    const getCreateSQL = () => {
        axios.post("/generate-create-query", { metadata: jsonData })
            .then((response) => {
                if (response.data.success) {
                    setQueries(response.data.queries);
                    setShowSql(true)
                } else {

                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div>
            <Typography variant="h6">JSON Schema</Typography>
            <Box sx={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', marginTop: '10px', maxHeight: '300px', overflowY: 'auto', maxWidth: '900px', overflowX: 'auto' }}>
                <pre>{JSON.stringify(jsonData, null, 2)}</pre>
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={handleCopy}
                style={{ marginTop: '10px' }}
            >
                Copy JSON Data
            </Button>

            <Button
                variant="outlined"
                color="primary"
                onClick={getCreateSQL}
                style={{ marginTop: '10px', marginLeft: '10px' }}
            >
                Get Create query
            </Button>

            {copySuccess && <Typography variant="body2" style={{ color: 'green', marginTop: '10px' }}>JSON data copied to clipboard!</Typography>}
            {showSql && <SqlCodeSnippet sqlQueries={queries} />}

        </div>
    );
};

export default JsonDisplay;
