import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Grid } from '@mui/material';

export default function SelectDatabase() {
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    return (
        <Grid container justifyContent='center' alignItems='center'>
            <FormControl sx={{ m: 1, minWidth: 400 }} size="small">
                <InputLabel id="demo-select-small-label">Database</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={age}
                    label="Age"
                    onChange={handleChange}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>CRAVE_ACCOUNTS_LIVE</MenuItem>
                    <MenuItem value={20}>CRAVE_DEV_1</MenuItem>
                    <MenuItem value={30}></MenuItem>
                </Select>
            </FormControl>
        </Grid>
    );
}
