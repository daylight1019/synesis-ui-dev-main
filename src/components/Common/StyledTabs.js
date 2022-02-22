import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

const StyledTabs = withStyles({
    indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        '& > span': {
            maxWidth: 90,
            width: '80%',
            backgroundColor: '#E24A87',
            marginRight: 'auto'
        },
    },
})((props) => <Tabs variant="scrollable"
    {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing(1),
        fontSize: theme.typography.pxToRem(15),
        paddingLeft: 0,
        paddingBottom: 0,
        color: '#E24A87',
        '&:hover': {
            color: '#E24A87',
            opacity: 1,
        },
        '&[aria-selected=false]': {
            color: '#ADAAB9',
        },
        '&:focus': {
            color: '#E24A87',
        },
    },
}))((props) => <Tab disableRipple {...props} />);

export { StyledTab, StyledTabs };