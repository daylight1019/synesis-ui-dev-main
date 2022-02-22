import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import theme from "../../utils/theme";
import { useDispatch } from "react-redux";
import { Typography, Button, Dialog, DialogTitle, IconButton, Grid } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import profile from "../../assets/img/profile.png";
import { setRole } from '../../redux/ducks/main';
import store from '../../redux';
import { withRouter, useLocation } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    txt: {
        fontWeight: 400,
        fontStyle: 'normal',
        fontSize: 36,
        color: 'white'
    },
    changeDiv: {
        display: 'flex'
    },
    roleDiv: {
        display: 'flex'
    },
    typeTxt: {
        color: 'grey',
        fontSize: 16,
        fontWeight: 400,
        marginRight: 5,
        alignSelf: 'center'
    },
    roleTxt: {
        color: 'white',
        fontSize: 16,
        fontWeight: 400,
        alignSelf: 'center',
        marginRight: 28
    },
    roleBtn: {
        backgroundColor: '#4A4361',
        textTransform: 'none',
        color: 'white'
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    dialogDiv: {
        width: 150,
        height: 150,
        border: '1px solid grey',
        borderRadius: 10,
        cursor: 'pointer',
        textAlign: 'center',
        textTransform: 'none',
        display: 'block'
    },
    dialogDivSelected: {
        textAlign: 'center',
        width: 150,
        height: 150,
        border: '1px solid green',
        borderRadius: 10,
        cursor: 'pointer',
        textTransform: 'none',
        display: 'block'
    },
    contentDiv: {
        padding: 30
    },
    btnDiv: {
        padding: 20
    },
    changeBtn: {
        width: '100%',
        marginTop: 20
    }
}));

const CampaignHeader = (props) => {

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Typography className={classes.txt}>Campaigns</Typography>
        </div>
    );
}

export default withRouter(CampaignHeader);