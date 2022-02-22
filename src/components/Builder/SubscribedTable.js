import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    TableContainer, Table, TableHead,
    TableRow,
    TableCell,
    TableBody, TablePagination,
    Button,
    TextField,
    Typography, Dialog, DialogTitle, IconButton, Grid
} from '@material-ui/core';
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
    stakeDivs: {
        marginBottom: 5,
        marginTop: 5
    },
    accumtxt: {
        fontSize: 12
    },
    txtTitle: {
        fontWeight: 'bold'
    },
    txtValue: {

    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
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
        width: 200
    },
    dashtxt: {
        fontSize: 24,
        marginBottom: 40,
        color: '#E34A86'
    },
    dashtitle1: {
        fontSize: 18
    },
    inputfield: {
        color: 'white',
        border: '1px solid #60548B',
    },
    selectDropdown: {
        color: "#fff",
        backgroundColor: "#1b1f38",
    },
}));

const headCells = [
    { id: 'topic', numeric: true, disablePadding: true, label: 'Topic' },
    { id: 'status', numeric: false, disablePadding: true, label: 'Status' },
    { id: 'progress', numeric: false, disablePadding: false, label: 'Progress to competion' },
    { id: 'remain', numeric: false, disablePadding: false, label: 'Remaining time' },
    { id: 'penalty', numeric: false, disablePadding: false, label: 'Penalties' },
    // { id: 'value', numeric: false, disablePadding: false, label: 'BTC Value' },
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
    const [display, setColor] = React.useState('contents');
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');
    const [index, setIndex] = React.useState(0);

    const builder = useSelector(state => state.main.builder);
    const architect = useSelector(state => state.main.architect);
    const adminkey = useSelector(state => state.main.adminkey);
    const program = useSelector(state => state.main.program);
    const stakingProgram = useSelector(state => state.main.stakingProgram);
    const [selectedCam, setSelectedCam] = React.useState({})

    const handlesubmit = async () => {
        let utterance = value;
        try {
            let pool = await program.state.fetch();
            const campaign = await program.account.campaignAccount.fetch(selectedCam.publicKey);
            for (let i = 0; i < 3; i++) {
                const transaction = await program.rpc.utterance(
                    utterance + i,
                    {
                        accounts: {
                            builder: builder.publicKey,
                            campaignAccount: selectedCam.publicKey,
                            pool: program.state.address(),
                            datafarm: program.programId,
                        },
                        signers: [builder]
                    }
                );
            }

            const campaignData = await program.account.campaignAccount.fetch(selectedCam.publicKey);
            const campaignAddr = await program.account.campaignAccount.associatedAddress(selectedCam.publicKey);
            console.log("\t", campaignData.head.toString(), " utterances submited to campaign : ", campaignAddr.toBase58());
            let utter = new TextDecoder("utf-8").decode(new Uint8Array(campaignData.utterances[0].data));
            for (let j = 0; j < campaignData.head; j++) {
                let test = new TextDecoder("utf-8").decode(new Uint8Array(campaignData.utterances[j].data));
                console.log("\tutterance : ", test,
                    " submitted by ", campaignData.utterances[j].builder.toBase58(),
                    "and validation status :", campaignData.utterances[j].validated);
            }

        } catch (error) {
            alert(error)
        }
        setOpen(false);
        setValue('')
        props.getList();
    }

    const getStatus = async () => {
        try {
            let pool = await program.state.fetch();
            const campaign = await program.account.campaignAccount.fetch(selectedCam.publicKey);
            console.log('campaign', campaign)
            let totalValidated = 0;
            for (let j = 0; j < campaign.head; j++) {
                let test = new TextDecoder("utf-8").decode(new Uint8Array(campaign.utterances[j].data));
                console.log("\tutterance : ", test,
                    "\n\tbuilder is ", campaign.utterances[j].builder.toBase58());
                console.log("\n\tvalidators are ");
                let num_validator = (campaign.utterances[j].correct.toNumber() + campaign.utterances[j].incorrect.toNumber());
                for (let k = 0; k < num_validator; k++) {
                    console.log("\t\t", campaign.utterances[j].validators[k].toBase58());
                }
                totalValidated += campaign.utterances[j].correct.toNumber();
                totalValidated += campaign.utterances[j].incorrect.toNumber();
                console.log("\n\tvalidation correct :", campaign.utterances[j].correct.toNumber(),
                    "\n\tvalidation incorrect :", campaign.utterances[j].incorrect.toNumber(),
                    "\n\tvalidation status :", campaign.utterances[j].finish
                );
            }
            // const stake = await stakingProgram.account.stakeAccount.fetch(selectedCam.publicKey);

            console.log("Total Validated", totalValidated);
            console.log("Minimum Validated", selectedCam.minValidator);
            // console.log("Stake account", stake);
        } catch (e) {
            console.error(e);
        }
    }

    const handleClickOpen = (index) => {
        setIndex(index)
        setSelectedCam(active_data[index]);
        console.log("active_cam", active_data[index])
        setOpen(true);
        getStatus();
    };

    const handleClose = () => {
        setValue('')
        setOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleInput = (event) => {
        setValue(event.target.value)
    }

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
                                        <TableCell align="center" className={classes.tableBody} onClick={() => handleClickOpen(index)}><Button variant='contained' color='primary' size="large">More</Button></TableCell>
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
                            <Typography className={classes.lefttxt1}>Rewrite the phraze below differently</Typography>
                            <Typography className={classes.lefttxt2}>I need to make a return</Typography>
                            <TextField onChange={handleInput} value={value} InputProps={{
                                className: classes.inputfield
                            }} id="outlined-basic" size='small' fullWidth variant="outlined" />
                            <Button onClick={handlesubmit} className={classes.submitBtn} size='large'>Submit</Button>
                        </Grid>
                        <Grid item xs={5} className={classes.rightDiv}>
                            <Typography className={classes.dashtxt}>Builder Stats:</Typography>
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