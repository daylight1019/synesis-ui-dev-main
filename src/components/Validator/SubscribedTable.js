import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    TableContainer, Table, TableHead,
    TableRow,
    TableCell,
    TableBody, TablePagination,
    Button,
    Typography, Dialog, DialogTitle, IconButton, Grid,
} from '@material-ui/core';
import Popover from "@material-ui/core/Popover";
import CloseIcon from '@material-ui/icons/Close';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: 40
    },
    table: {
        minWidth: 750,
        borderCollapse: 'separate',
        borderSpacing: '0px 5px',
    },
    tblpagination: {
        color: 'white'
    },
    tableHead: {
        color: 'grey',
        borderBottom: "none",
        paddingTop: 60,
        paddingBottom: 25
    },
    tblRow: {
        background: '#231C3D',
        '&:nth-child(even)': {
            background: '#292244'
        }
    },
    tableBody: {
        color: 'white',
        borderBottom: "none",
    },

    contentDiv: {
        paddingLeft: 90,
        paddingRight: 90,
        paddingBottom: 65,
        paddingTop: 45,
    },
    valuedivs: {
        marginBottom: 5
    },
    txtTitle: {
        fontWeight: 'bold'
    },
    txtValue: {

    },
    statusDiv: {
        borderRadius: 5,
        background: '#3d3c70',
        padding: 10,

    },
    statusDivTxt: {
        color: '#7d8bee',
        fontSize: 16,
        fontWeight: 400,
    },
    statusCompletedDiv: {
        borderRadius: 5,
        background: '#195350',
        padding: 10,

    },
    statusCompletedDivTxt: {
        color: '#08b271',
        fontSize: 16,
        fontWeight: 400,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    statusDiv: {
        borderRadius: 5,
        background: '#7988E8',
        padding: 10,

    },
    organizeTxt: {
        color: '#8291F6'
    },
    statusDivTxt: {
        color: 'white',
        fontSize: 16,
        fontWeight: 400,
    },
    leftDiv: {
        paddingTop: 30,
        paddingRight: 40,
        paddingBottom: 40,
        borderRight: "1px solid",
        borderImageSlice: 1,
        borderImageSource: " linear-gradient(90deg, #8B63F3 -11.75%, #E8487F 105.01%)"
    },
    rightDiv: {
        paddingTop: 30,
        paddingLeft: 40,
        paddingRight: 30
    },
    leftlink: {
        fontSize: 14,
        marginBottom: 15,
    },
    lefttxt1: {
        fontSize: 24,
        marginBottom: 10,
    },
    lefttxt2: {
        fontSize: 24,
        marginBottom: 20,
    },
    submitBtn: {
        textTransform: 'none',
        color: 'white',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
        background: 'linear-gradient(90deg, #8B63F3 -11.75%, #E8487F 105.01%)',
        '&:hover': {
            background: 'linear-gradient(270deg, #8B63F3 -28.4%, #E8487F 167.84%)'
        },
        height: 40,
        width: 100
    },
    submitBtn1: {
        textTransform: 'none',
        color: 'white',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
        borderColor: 'white',
        '&:hover': {
            background: '#6A5E8E'
        },
        height: 40,
        width: 100
    },
    dashtxt: {
        fontSize: 24,
        marginBottom: 40,
        color: '#E34A86'
    },
    dashtitle1: {
        fontSize: 18
    },
    stakeDivs: {
        marginBottom: 5,
        marginTop: 5
    },
    accumtxt: {
        fontSize: 12
    },
    selectDropdown: {
        color: "#fff",
        backgroundColor: "#1b1f38",
    },
    popup: {
        color: "#fff",
        backgroundColor: "#1b1f38",
        padding: 10
    }
}));

const headCells = [
    { id: 'topic', numeric: true, disablePadding: true, label: 'Topic' },
    { id: 'status', numeric: false, disablePadding: true, label: 'Status' },
    { id: 'progress', numeric: false, disablePadding: false, label: 'Progress to competion' },
    { id: 'remain', numeric: false, disablePadding: false, label: 'Remaining time' },
    { id: 'penalty', numeric: false, disablePadding: false, label: 'Penalties' },
    { id: 'apy', numeric: false, disablePadding: false, label: 'Estimated APY (%)' },
    { id: 'deactivate', numeric: false, disablePadding: false, label: 'Deactiavate' },
];

function EnhancedTableHead(props) {
    const { classes, rowCount } = props;
    return (
        <TableHead className={classes.tableRow}>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'left' : 'center'}
                        padding={'default'}
                        className={classes.tableHead}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}


const SubscribedTable = (props) => {

    const { active_data } = props;
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [index, setIndex] = React.useState(0);
    const [errorPopUp, setErrorPopup] = useState(false);
    const [anchorEl, setAnchorEl] = useState();

    const program = useSelector(state => state.main.program);
    const adminkey = useSelector(state => state.main.adminkey);
    const [selectedCam, setSelectedCam] = React.useState({})
    const [handling, setHandling] = React.useState(false);
    const anchor = require('@project-serum/anchor');
    const validator = useSelector(state => state.main.validator);

    const handleYes = async () => {
        console.log("YES")
        setHandling(true);
       
        const campaignData = await program.account.campaignAccount.fetch(selectedCam.publicKey);
        console.log(campaignData)
        try {
            let utterance0 = new TextDecoder("utf-8").decode(new Uint8Array(campaignData.utterances[0].data));
            let utterance1 = new TextDecoder("utf-8").decode(new Uint8Array(campaignData.utterances[1].data));

            // validated first submitted utterance
            if (utterance0.startsWith("hello utterance0")) {
                await program.rpc.validate(
                    new anchor.BN(0),
                    true,
                    {
                        accounts: {
                            validator: validator.publicKey,
                            campaignAccount: selectedCam.publicKey,
                            pool: program.state.address(),
                            datafarm: program.programId,
                        },
                        signers: [validator]
                    }
                );
            }
            // refuse second submitted utterance
            if (utterance1.startsWith("hello utterance1")) {
                await program.rpc.validate(
                    new anchor.BN(1),
                    true,
                    {
                        accounts: {
                            validator: validator.publicKey,
                            campaignAccount: selectedCam.publicKey,
                            pool: program.state.address(),
                            datafarm: program.programId,
                        },
                        signers: [validator]
                    }
                );
            }

        } catch (error) {
            alert(error)
        }
        setHandling(false);
        if (selectedCam.validateIndex < selectedCam.utterances.length - 1) {
            props.setIndex(index)
        } else {
            setOpen(false);
        }
        // props.getList();
        // setOpen(false);
    }

    const handleClickOpen = (event, index) => {
        setIndex(index)
        console.log('active_data[index]', active_data[index])
        setSelectedCam(active_data[index]);
        if (active_data[index].utterances.filter(item => !item.finish).length === 0) {
            setErrorPopup(index);
            setAnchorEl(event.currentTarget);
        } else {
            setOpen(true);
        }
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const onClosePopup = () => {
        console.log("closed")
        setAnchorEl(null);
        console.log(Boolean(anchorEl), anchorEl)
    };

    return (
        <div className={classes.root}>
            <TableContainer>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size='medium'
                    aria-label="enhanced table"
                >
                    <EnhancedTableHead
                        classes={classes}
                        rowCount={active_data.length}
                    />
                    <TableBody>
                        {
                            active_data && active_data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.coin)}
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={index}
                                        className={classes.tblRow}
                                    >
                                        <TableCell align="left" className={classes.tableBody}>{row.topic}</TableCell>
                                        {
                                            row.utterances.length === 0 ?
                                                <TableCell align="center" className={classes.tableBody}><div className={classes.statusDiv}><Typography className={classes.statusDivTxt}>In progress</Typography></div></TableCell>
                                                :
                                                <TableCell align="center" className={classes.tableBody}><div className={row.status !== 0 ? classes.statusDiv : classes.statusCompletedDiv}><Typography className={row.status !== 0 ? classes.statusDivTxt : classes.statusCompletedDivTxt}>{row.status === 0 ? 'Completed' : 'In progress'}</Typography></div></TableCell>

                                        }
                                        {
                                            row.utterances.length === 0 ?
                                                <TableCell align="center" className={classes.tableBody}>0% (0/0)</TableCell> :
                                                <TableCell align="center" className={classes.tableBody}>{parseInt(row.utterances.filter(item => item.finish).length / row.utterances.filter(item => !item.finish).length * 100)}% ({row.utterances.filter(item => item.finish).length}/{row.utterances.filter(item => !item.finish).length})</TableCell>

                                        }
                                        <TableCell align="center" className={classes.tableBody}>{row.timeLimit - row.initLimit}d / {row.timeLimit}d</TableCell>
                                        <TableCell align="center" className={classes.tableBody}>{row.penalty}</TableCell>
                                        <TableCell align="center" className={classes.tableBody}>{row.apy}</TableCell>
                                        <TableCell align="center" className={classes.tableBody}>
                                            <Button variant='contained' color='primary' size="large" onClick={(e) => handleClickOpen(e, index)}>More</Button>
                                            <Popover
                                                open={Boolean(anchorEl)}
                                                onClose={onClosePopup}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                }}
                                                anchorEl={anchorEl}
                                            >
                                                <Typography className={classes.popup} sx={{ p: 5 }}>No more utterances are available now.</Typography>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                className={classes.tblpagination}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={active_data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                SelectProps={{
                    MenuProps: { classes: { paper: classes.selectDropdown } }
                }}
            />
            <Dialog scroll='body' onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}
                PaperProps={{
                    style: {
                        backgroundColor: '#453A6B',
                        boxShadow: 'none',
                    },
                }} maxWidth='md' fullWidth={true}>
                <DialogTitle disableTypography>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <div className={classes.contentDiv}>
                    <Grid container className={classes.valuedivs}>
                        <Grid item xs={7} className={classes.leftDiv}>
                            <Typography className={classes.leftlink}>Insurance/coverage limits</Typography>
                            <Typography className={classes.lefttxt1}>Are the phrases similar?</Typography>
                            <Typography className={classes.lefttxt2}>1 {selectedCam.phrase}</Typography>
                            <Typography className={classes.lefttxt2}>2. {selectedCam.utterances == null || selectedCam.utterances.length === 0 ? '' : new TextDecoder().decode(Uint8Array.from(selectedCam.utterances[selectedCam.validateIndex]?.data.filter(item =>
                                item !== 0)))}</Typography>
                            <Grid container spacing={3}>
                                <Grid item><Button onClick={handling ? null : handleYes} className={classes.submitBtn} size='large'>Yes</Button></Grid>
                                <Grid item><Button onClick={() => setOpen(false)} className={classes.submitBtn1} size='medium' variant='outlined'>No</Button></Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={5} className={classes.rightDiv}>
                            <Typography className={classes.dashtxt}>Validator Stats:</Typography>
                            <Grid container className={classes.stakeDivs}>
                                <Grid item xs={6}>
                                    <Typography className={classes.dashtitle1}>Staked:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography className={classes.dashtitle1}>0 SNS</Typography>
                                </Grid>
                            </Grid>
                            <Typography className={classes.accumtxt}>Accumulated </Typography>
                            <Grid container className={classes.stakeDivs}>
                                <Grid item xs={6}>
                                    <Typography className={classes.dashtitle1}>Rewards:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography className={classes.dashtitle1}>0 SNS</Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.stakeDivs}>
                                <Grid item xs={6}>
                                    <Typography className={classes.dashtitle1}>Submitted:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography className={classes.dashtitle1}>0</Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.stakeDivs}>
                                <Grid item xs={6}>
                                    <Typography className={classes.dashtitle1}>Validated: </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography className={classes.dashtitle1}>0</Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.stakeDivs}>
                                <Grid item xs={6}>
                                    <Typography className={classes.dashtitle1}>Processing: </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography className={classes.dashtitle1}>0</Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.stakeDivs}>
                                <Grid item xs={6}>
                                    <Typography className={classes.dashtitle1}>Rejected:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography className={classes.dashtitle1}>0</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Dialog>

        </div>
    );
}

export default withRouter(SubscribedTable);