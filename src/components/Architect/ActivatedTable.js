import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    TableContainer, Table, TableHead,
    TableRow,
    TableCell,
    TableBody, TablePagination,
    Button,
    Typography, Dialog, DialogTitle, IconButton, Grid
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

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
    tableRow: {
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
        paddingBottom: 40,
        paddingTop: 20,
    },
    valuedivs: {
        marginBottom: 5
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
    detailtxt: {
        fontSize: 24
    },
    divider: {
        width: '100%',
        height: 2,
        background: 'linear-gradient(90deg, #8B63F3 -11.75%, #E8487F 105.01%)',
        marginBottom: 40
    },
    btns: {
        textTransform: 'none',
        width: 200,
        marginTop: 40
    },
    btns1: {
        textTransform: 'none',
        color: 'white',
        borderColor: 'white',
        width: 200,
        marginTop: 40
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
    const { classes } = props;
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


const ActivatedTable = (props) => {

    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [selectedCam, setSelectedCam] = React.useState({})



    const handleClickOpen = (index) => {
        setSelectedCam(props.active_data[index]);
        setOpen(true);
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
                        rowCount={props.active_data.length}
                    />
                    <TableBody>
                        {
                            props.active_data && props.active_data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
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
                count={props.active_data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                SelectProps={{
                    MenuProps: { classes: { paper: classes.selectDropdown } }
                }}
            />
            <Dialog onClose={handleClose} scroll='body' aria-labelledby="customized-dialog-title" open={open} PaperProps={{
                style: {
                    backgroundColor: '#453A6B',
                    boxShadow: 'none',
                },
            }} maxWidth='md' fullWidth>
                <DialogTitle disableTypography>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <div className={classes.contentDiv}>
                    <Typography className={classes.detailtxt}>Details</Typography>
                    <div className={classes.divider} />
                    <Grid container className={classes.valuedivs}>
                        <Grid item xs={4}>
                            <Typography className={classes.txtTitle}>
                                Organizer:
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography className={classes.txtValue}>
                                mind.ai
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.valuedivs}>
                        <Grid item xs={4}>
                            <Typography className={classes.txtTitle}>
                                Industry/domain:
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography className={classes.txtValue}>
                                {selectedCam.domain}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.valuedivs}>
                        <Grid item xs={4}>
                            <Typography className={classes.txtTitle}>
                                Topic subject:
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography className={classes.txtValue}>
                                {selectedCam.topic}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.valuedivs}>
                        <Grid item xs={4}>
                            <Typography className={classes.txtTitle}>
                                Example seed phrases:
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography className={classes.txtValue}>
                                {selectedCam.phrase}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.valuedivs}>
                        <Grid item xs={4}>
                            <Typography className={classes.txtTitle}>
                                Reward per utterance:
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography className={classes.txtValue}>
                                {selectedCam.rewardPerBuilder} SNS
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.valuedivs}>
                        <Grid item xs={4}>
                            <Typography className={classes.txtTitle}>
                                Total utterances to complete:
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography className={classes.txtValue}>
                                {selectedCam.utterances != null ? selectedCam.utterances.filter(item => !item.finish).length : 0}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.valuedivs}>
                        <Grid item xs={4}>
                            <Typography className={classes.txtTitle}>
                                Estimated APY:  </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography className={classes.txtValue}>
                                10%
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.valuedivs}>
                        <Grid item xs={4}>
                            <Typography className={classes.txtTitle}>
                                Time limit (days):</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography className={classes.txtValue}>
                                {selectedCam.timeLimit}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.valuedivs}>
                        <Grid item xs={4}>
                            <Typography className={classes.txtTitle}>
                                Staking required:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography className={classes.txtValue}>
                                12 SNS
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.valuedivs}>
                        <Grid item xs={4}>
                            <Typography className={classes.txtTitle}>
                                Slashing penalty:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography className={classes.txtValue}>
                                0.5 SNS
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.valuedivs}>
                        <Grid item xs={4}>
                            <Typography className={classes.txtTitle}>
                                Validations required:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography className={classes.txtValue}>
                                {selectedCam.validationQuorum}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction='row' justify="center" spacing={3}
                        alignItems="center" className={classes.valuedivs}>
                        <Grid item>
                            <Button className={classes.btns1} onClick={handleClose} variant='outlined' size='large'>Close</Button>
                        </Grid>
                        <Grid item >
                            <Button className={classes.btns} onClick={handleClose} variant='contained' size='large' color='primary'>Unstake</Button>
                        </Grid>
                    </Grid>
                </div>
            </Dialog>
        </div >
    );
}

export default ActivatedTable;