import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link, withRouter } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    }
}));


function Bottom(props) {
    const { window } = props;
    const classes = useStyles();

    let location = useLocation();

    return (
        <div className={classes.root}>
            
        </div>
    );
}



export default Bottom