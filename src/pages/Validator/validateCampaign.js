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
    },
    rightDiv: {
        paddingTop: 30,
        textAlign: 'center'
    },
    leftDiv: {

    },
    leftBar: {
        paddingTop: 100,
        paddingLeft: 40
    }
}));

const ValidateCampaign = (props) => {

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12} sm={6} className={classes.leftDiv}>
                    <Button
                        onClick={() => props.history.push('validator')}
                        className={classes.backbutton}
                        startIcon={<KeyboardBackspaceIcon />}
                    >
                        Back to campaigns
                    </Button>
                    <div className={classes.leftBar}>
                        <div>
                            <Typography>Insurance / coverage limits</Typography>
                            <Typography variant="h6">Are the phrases similar?</Typography>
                            <Typography variant="h5">1. I need to make a return</Typography>
                            <Typography variant="h5">2. Return my shoes</Typography>
                            <Grid container direction='row' justify="center" spacing={3}
                                alignItems="center" className={classes.valuedivs}>
                                <Grid item >
                                    <Button variant='contained' color='primary'>Yes</Button>
                                </Grid>
                                <Grid item>
                                    <Button variant='outlined'>No</Button>
                                </Grid>

                            </Grid>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.rightDiv}>
                    <h1>Dashboard</h1>
                </Grid>
            </Grid>
        </div>
    );
}

export default withRouter(ValidateCampaign);