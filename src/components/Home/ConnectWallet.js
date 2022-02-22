import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import theme from "../../utils/theme";
import { Typography, Box, Divider, FormControl, InputLabel, Select, MenuItem, ButtonGroup, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: 40
    }
}));

const ConnectWallet = () => {

    const classes = useStyles();

    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    return (
        <div className={classes.root}>
            
        </div>
    );
}

export default ConnectWallet;