import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import theme from "../../utils/theme";
import {
    TableContainer, Table, TableHead,
    TableRow,
    TableCell,
    TableSortLabel,
    TableBody, TablePagination,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography, Grid
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { userCharge, poolVaultGen } from '../../utils/helper';

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: 40
    },
    table: {
        minWidth: 750,
        borderCollapse: 'separate',
        borderSpacing: '0px 5px',
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
    tblpagination: {
        color: 'white'
    },
    tableBody: {
        color: 'white',
        borderBottom: "none",
    },
    contentDiv: {
        paddingLeft: 110,
        paddingRight: 10,
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
    organizeTxt: {
        color: '#8291F6'
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
        marginBottom: 40
    },
    dashtitle1: {
        fontSize: 18
    },
    selectDropdown: {
        color: "#fff",
        backgroundColor: "#1b1f38",
    },
}));


const headCells = [
    { id: 'topic', numeric: true, disablePadding: true, label: 'Topic' },
    { id: 'organizer', numeric: false, disablePadding: true, label: 'Organizer' },
    { id: 'total', numeric: false, disablePadding: false, label: 'Total utterances' },
    { id: 'estimated', numeric: false, disablePadding: false, label: 'Estimated (days)' },
    { id: 'limits', numeric: false, disablePadding: false, label: 'Time limits (days)' },
    { id: 'apy', numeric: false, disablePadding: false, label: 'Estimated APY (%)' },
    { id: 'architectStakeAmount', numeric: false, disablePadding: false, label: 'STAKE AMOUNT (SNS)' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
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


const AvailableTable = (props) => {

    const { available_data } = props;

    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState([]);
    const [index, setIndex] = React.useState(0)

    const [stakeConfirm, setStakeConfirmDialog] = useState(false);

    const dataFarmProgram = useSelector(state => state.main.program);
    const stakingProgram = useSelector(state => state.main.stakingProgram);
    const adminkey = useSelector(state => state.main.adminkey);
    const architect = useSelector(state => state.main.architect);
    const validator = useSelector(state => state.main.validator);
    const user = useSelector(state => state.main.user);
    const owner = useSelector(state => state.main.owner);
    const mint = useSelector(state => state.main.mint);
    const poolVault = useSelector(state => state.main.poolVault);

    const [selectedCam, setSelectedCam] = React.useState({})

    const [staking, setStaking] = useState(false);

    const anchor = require('@project-serum/anchor');
    const TokenInstructions = require("@project-serum/serum").TokenInstructions;

    const handleClickOpen = (index) => {
        setIndex(index)
        setSelectedCam(available_data[index]);
        setStakeConfirmDialog(true);
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

    const stakeCampaign = async (ind) => {
        try {
            if (staking) return;
            setStaking(true);
            // const campaign = await dataFarmProgram.account.campaignAccount.fetch(selectedCam.publicKey);
            let pool = await dataFarmProgram.state.fetch();
            const campaignAddr = await dataFarmProgram.account.campaignAccount.associatedAddress(available_data[ind].publicKey);
            // const [_pda, _nonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(anchor.utils.bytes.utf8.encode("datafarm"))], dataFarmProgram.programId);

            // let to = await createTokenAccount(provider, mint, provider.wallet.publicKey);
            // let poolVault = new PublicKey("ByNEfXJELGd5vkfBWohVTB3hzszPbRbPVbi3HXvM695o");
            // let architectToken = new PublicKey("BribNBNLMK6DQgCkqSrDwsNEFRoNTfcZLYoo6aLLHFHb");
            let architectToken = await userCharge(mint, architect, owner);
            let architectPubKey = new PublicKey("2BCK6PepD5RRVPoDNauZdSRcxWwEzP89eYt2aBWuudRZ");
            let myAccount = anchor.web3.Keypair.generate();

            // let ar = await splToken.Token.getAssociatedTokenAddress(dataFarmProgram.programId, stakingProgram.programId, architect.publicKey, myAccount.publicKey);
            // const provid = anchor.Provider.local();

            let stakeAccount = await mint.getAccountInfo(architectToken.address);
            await stakingProgram.rpc.stake(
                {
                    accounts: {
                        stakeAccount: myAccount.publicKey, // mint,
                        user: architect.publicKey,
                        userToken: architectToken.address,
                        cpiState: dataFarmProgram.state.address(),
                        datafarm: dataFarmProgram.programId,
                        campaign: campaignAddr,
                        poolVault: poolVault.address,
                        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
                        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                    },
                    instructions: [
                        await stakingProgram.account.stakeAccount.createInstruction(myAccount),
                    ],
                    signers: [myAccount, architect],
                });
            const stake = await stakingProgram.account.stakeAccount.fetch(myAccount.publicKey);
            console.log("Stake Result", stake);
            if (stake.status === true) {
                alert("Successfully Staked!")
            } else {
                alert("Stake error!");
            }
            setStaking(false);
            setStakeConfirmDialog(false);
        } catch (e) {
            setStaking(false);
            console.error(e);
        }
    }

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
                        rowCount={available_data.length}
                    />
                    <TableBody>
                        {
                            available_data && available_data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.coin)}
                                        role="checkbox"
                                        tabIndex={-1}
                                        className={classes.tblRow}
                                        key={index}>
                                        <TableCell align="left" className={classes.tableBody}>{row.topic}</TableCell>
                                        <TableCell align="center" className={classes.tableBody}><Typography className={classes.organizeTxt}>{row.organizer}</Typography></TableCell>
                                        <TableCell align="center" className={classes.tableBody}>{row.utterances.length}</TableCell>
                                        <TableCell align="center" className={classes.tableBody}>{row.estimated}</TableCell>
                                        <TableCell align="center" className={classes.tableBody}>{row.timeLimit}</TableCell>
                                        <TableCell align="center" className={classes.tableBody}>{row.apy}</TableCell>
                                        <TableCell align="center" className={classes.tableBody}>{row.architectStakeAmount}</TableCell>
                                        <TableCell align="center" className={classes.tableBody} onClick={() => handleClickOpen(index)}><Button variant='contained' color='primary' size="large">Stake</Button></TableCell>
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
                count={available_data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                SelectProps={{
                    MenuProps: { classes: { paper: classes.selectDropdown } }
                }}
            />
            <Dialog onClose={() => setStakeConfirmDialog(false)} scroll='body' aria-labelledby="customized-dialog-title" open={stakeConfirm} PaperProps={{
                style: {
                    backgroundColor: '#453A6B',
                    boxShadow: 'none',
                },
            }} maxWidth='sm' fullWidth>
                <DialogTitle disableTypography>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={() => setStakeConfirmDialog(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography className={classes.detailtxt}>Do you want to stake?</Typography>
                    <DialogActions>
                        <Button className={classes.btns1} variant='outlined' size="large" onClick={() => setStakeConfirmDialog(false)}>
                            Cancel
                        </Button>
                        <Button className={classes.btns} variant="contained" size="large" onClick={stakeCampaign}>
                            {staking ? "Staking Now..." : "Confirm"}
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default withRouter(AvailableTable);