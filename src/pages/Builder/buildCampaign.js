import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import theme from "../../utils/theme";
import { Typography, Grid, Button, TextField } from '@material-ui/core';
import { withRouter, useLocation } from 'react-router-dom';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        minHeight: 'calc(100vh - 103px)',
        backgroundColor: '#332B4F',
        padding: '30px 45px',
    },
    backbutton: {
        color: 'white',
        marginBottom: 20
    },
    inputfield: {
        "& .MuiFilledInput-root": {
            background: "white"
        }
    },
    title: {
        color: 'white',
        marginBottom: 10
    },
    inputdivs: {
        marginBottom: 20
    },
    btn: {
        textTransform: 'none'
    }
}));

const BuildCampaign = (props) => {

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Button
                        onClick={() => props.history.push('builder')}
                        className={classes.backbutton}
                        startIcon={<KeyboardBackspaceIcon />}
                    >
                        Back to campaigns
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}></Grid>
            </Grid>
        </div>
    );
}

export default withRouter(BuildCampaign);