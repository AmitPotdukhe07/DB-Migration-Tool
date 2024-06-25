import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const SqlCodeSnippet = ({ sqlQueries }) => {
    const combinedQueries = sqlQueries.join('\n\n');
    const [showCopy, setShowCopy] = useState(false)

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                SQL Code Snippets
            </Typography>
            <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                    Combined Queries
                </Typography>
                <SyntaxHighlighter language="sql" style={dark}>
                    {combinedQueries}
                </SyntaxHighlighter>
                <Box mt={2}>
                    <CopyToClipboard text={combinedQueries}>
                        <Button variant="contained" color="primary" onClick={() => setShowCopy(true)}>
                            Copy to Clipboard
                        </Button>

                    </CopyToClipboard>
                    {showCopy && <Typography sx={{ color: 'green' }}>SQL queries copied to clipboard!</Typography>}
                </Box>
            </Box>
        </Container>
    );
};

export default SqlCodeSnippet;

