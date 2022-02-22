import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import BG from '../../assets/img/BG.png'

const useStyles = makeStyles((theme) => ({
    homeroot: {
        flexGrow: 1,
        width: '100%',
        
        backgroundColor: '#332B4F',
        padding: '30px 45px',
        textAlign: 'center',
        backgroundImage: `url(${BG})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
    },
    homeimgMark: {
        marginTop: 80
    },
    homemainDiv: {
        position: 'absolute',
        top: 350,
        width: 'calc(100vw - 90px)'
    },
    hometitle: {
        fontSize: 96,
        lineHeight: 1.2
    },
    homeexploreBtn: {
        textTransform: 'none',
        color: 'white',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
        background: 'linear-gradient(90deg, #8B63F3 -11.75%, #E8487F 105.01%)',
        '&:hover': {
            background: 'linear-gradient(270deg, #8B63F3 -28.4%, #E8487F 167.84%)'
        },
        width: 300
    },
    homebtnDiv: {
        marginTop: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    homebtnSocial: {
    }
}));

const Home = () => {

    const classes = useStyles();

    return (
        <div></div>
    );
}

export default Home;