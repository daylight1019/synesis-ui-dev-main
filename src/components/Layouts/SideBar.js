import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link, withRouter } from "react-router-dom";

import ListAltIcon from '@material-ui/icons/ListAlt';
import AssessmentIcon from '@material-ui/icons/Assessment';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';


import logo from "../../assets/img/logo.png";
import Avatar from '@material-ui/core/Avatar';
import { useLocation } from 'react-router-dom';

const drawerWidth = 64;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        backgroundColor: theme.palette.secondary.main,
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,

    drawerMain: {
        backgroundColor: theme.palette.secondary.main,
    },

    drawerPaper: {
        width: drawerWidth,
        textAlign: 'center',
        backgroundColor: theme.palette.secondary.main,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    sideIcon: {
        color: "white",
    },

    logoIcon: {
        marginTop: '32px',
        display: 'inline-block',
        marginBottom: '50px'
    },
    profileIcon: {
        marginTop: '50px',
        display: 'inline-block',
    },
    navIcon: {
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: '20px',
        marginBottom: '20px',

    },
    selectedNavIcon: {
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: '20px',
        marginBottom: '20px',
        background: theme.palette.primary.main
    }
}));


function SideBar(props) {
    const { window } = props;
    const classes = useStyles();
    const navItems = [{
        name: <ListAltIcon />,
        link: '/list'
    },
    {
        name: <AssessmentIcon />,
        link: '/analytics'
    },
    {
        name: <MonetizationOnIcon />,
        link: '/detail'
    }
    ];
    const drawer = (path, handelclose) => (
        <div className={classes.drawerMain}>

            <Link className={classes.sideIcon} to='/' onClick={handelclose}>
                <Avatar className={classes.logoIcon} src={logo} alt="logo" />
            </Link>

            {navItems.map((value, index) => {

                return (
                    <div className={path === value.link ? classes.selectedNavIcon : classes.navIcon} key={index}>
                        <Link className={classes.sideIcon} to={value.link} onClick={handelclose}>{value.name}
                        </Link>
                    </div>
                );
            })}
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    let location = useLocation();

    return (
        <nav className={classes.drawer} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
                <Drawer
                    container={container}
                    variant="temporary"
                    anchor='left'
                    open={props.mobileDrawerOpened}
                    onClose={props.handleMobileDrawerClose}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    {drawer(location.pathname, props.handleMobileDrawerClose)}
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                >
                    {drawer(location.pathname, props.handleMobileDrawerClose)}
                </Drawer>
            </Hidden>
        </nav>

    );
}



export default SideBar