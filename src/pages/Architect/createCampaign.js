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

const CreateCampaign = (props) => {

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Button
                onClick={() => props.history.push('architect')}
                className={classes.backbutton}
                startIcon={<KeyboardBackspaceIcon />}
            >
                Back to campaigns
            </Button>
            <Grid className={classes.inputdivs} container spacing={3}>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Organizer</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={3}>
                    <Typography className={classes.title}>Topic domain</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={3}>
                    <Typography className={classes.title}>Topic subject</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
            </Grid>
            <Grid className={classes.inputdivs} container spacing={3}>
                <Grid item xs={12}>
                    <Typography className={classes.title}>Topic subject</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
            </Grid>
            <Grid className={classes.inputdivs} container spacing={3}>
                <Grid item xs={12}>
                    <Typography className={classes.title}>Example seed phrases</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' multiline={true}
                        rows={3} fullWidth variant="outlined" />
                </Grid>
            </Grid>
            <Grid className={classes.inputdivs} container spacing={3}>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Reward per utterance (SNS)</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Required utterances (items)</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
            </Grid>
            <Grid className={classes.inputdivs} container spacing={3}>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Time limit (days)</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Fixed Reward (%)</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
            </Grid>
            <Grid className={classes.inputdivs} container spacing={3}>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Mining Reward (%)</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Minimum Validations (# of utterances)</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
            </Grid>
            <Grid className={classes.inputdivs} container spacing={3}>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Validation Quorum (% of total)</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={3}
            >
                <Grid item>
                    <Button className={classes.btn} onClick={() => props.history.push('architect')}>
                        Cancel
                    </Button></Grid>
                <Grid item>
                    <Button className={classes.btn} variant='contained' color='primary' onClick={() => props.history.push('architect')}>
                        Create campaign
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default withRouter(CreateCampaign);