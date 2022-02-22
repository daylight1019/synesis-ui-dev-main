import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import { withRouter } from 'react-router-dom';
import { withStyles } from "@material-ui/core";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SideBar from "./Layouts/SideBar.js";
import Header from "./Layouts/Header.js";
import Routing from "./Routes";
import { CallReceived } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    root: {
    },
    menuButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 50,
        height: 50,
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
}));

function Main(props) {
    const [selectedTab, setSelectedTab] = useState(null);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const classes = useStyles();

    const handleMobileDrawerOpen = useCallback(() => {
        setIsMobileDrawerOpen(true);
    }, [setIsMobileDrawerOpen]);

    const handleMobileDrawerClose = useCallback(() => {
        setIsMobileDrawerOpen(false);
    }, [setIsMobileDrawerOpen]);

    const selectLanding = useCallback(() => {
        document.title =
            "Psychology";
        setSelectedTab("Landing");
    }, [setSelectedTab]);

    const scrollTop = useRef(null);

    useEffect(() => {
        scrollTop.current.scrollIntoView({ block: "start", behavior: "smooth" });
    }, [props.location.pathname])

    return (
        <div className={classes.root} ref={scrollTop}>
            {/* <SideBar
                selectedTab={selectedTab}
                selectTab={setSelectedTab}
                handleMobileDrawerOpen={handleMobileDrawerOpen}
                handleMobileDrawerClose={handleMobileDrawerClose}
                mobileDrawerOpened={isMobileDrawerOpen}
            /> */}
            <Header />
            <Routing
                selectLanding={selectLanding}
            />
        </div>
    );
}


export default withStyles({ withTheme: true })(memo(withRouter(Main)));
