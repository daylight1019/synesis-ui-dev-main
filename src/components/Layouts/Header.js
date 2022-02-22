import React, { useEffect, useCallback, useMemo } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link, withRouter, } from "react-router-dom";
import { Button, Dialog, DialogTitle, Grid, IconButton, Typography, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem } from "@material-ui/core";
import { useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import {
    Program, Provider, web3
} from '@project-serum/anchor';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Connection, PublicKey } from '@solana/web3.js';
import dataFarmJson from '../../contracts/Datafarm.json'
import stakingJson from '../../contracts/Staking.json'
import idJson from '../../contracts/id.json'
import { WalletModalButton } from '@solana/wallet-adapter-react-ui';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { shortenAddress } from '../../utils/convert'

import Logo from "../../assets/img/Logo.svg";
import sns from "../../assets/img/sns.png";
import walletimg from "../../assets/img/wallet.png";
import architect from "../../assets/img/architect.png";
import builder from "../../assets/img/builder.png";
import validator from "../../assets/img/validator.png";
import roleback from "../../assets/img/role_back.png";
import rolebackinactive from "../../assets/img/role_back_inactive.png";
import mark from '../../assets/img/mark.png'
import facebook from '../../assets/img/facebook.png'
import google from '../../assets/img/google.png'
import linkedin from '../../assets/img/linkedin.png'
import twitter from '../../assets/img/twitter.png'
import BG from '../../assets/img/BG.png'

import { setRole, setInit, setProgram, setPoolFlag, setStakingProgram } from '../../redux/ducks/main';
import store from '../../redux';
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from '@material-ui/icons/Close';
import { setItem, getItem, removeItem, userCharge, vaultCharge, poolVaultGen } from '../../utils/helper';


const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#231C3D',
        padding: '25px 50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    imglogo: {
    },
    buttonBox: {
        justifyContent: 'right'
    },
    walletButton: {
        width: 200,
        height: 50,
    },
    addressButton: {
        width: 450,
        height: 50,
    },
    btn: {
        backgroundColor: '#4A4361',
        fontSize: 18,
        fontWeight: 400,
        textTransform: 'none',
        marginRight: 20,
        paddingLeft: 30,
        paddingRight: 30,
        height: 50,
        color: 'white',
        '&:hover': {
            background: '#6A5E8E'
        }
    },
    btn1: {
        backgroundColor: '#08C477',
        fontSize: 18,
        textTransform: 'none',
        fontWeight: 400,
        fontStyle: 'normal',

        color: '#231C3D',
        paddingLeft: 30,
        height: 50,
        paddingRight: 30,
        '&:hover': {
            background: '#39D595'
        }
    },
    txtbal: {
        alignSelf: 'center',
        marginRight: 20,
        color: 'white'
    },
    headerDiv: {
        display: 'flex'
    },
    walletBtn: {
        width: 200,
        height: '100%',
        backgroundColor: '#2A2344',
    },
    balDiv: {
        width: 240,
        height: 50,
        background: '#332B4F',
        borderRadius: 5,
        padding: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 40,
    },
    balDiv1: {
        width: 265,
        height: 50,
        background: '#332B4F',
        borderRadius: 5,
        padding: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 40,
        cursor: 'pointer'
    },
    paper: {
        width: 265,
        backgroundColor: '#453A6B',
    },
    snsimg: {
        paddingLeft: 10
    },
    valueDiv: {
        width: 180,
        height: '100%',
        backgroundColor: '#2A2344',
        borderRadius: 5,
        padding: '6px 15px',
        paddingRight: 0,
        display: 'flex',
        alignItems: 'center'
    },
    valueDiv1: {
        width: 200,
        height: '100%',
        backgroundColor: '#2A2344',
        borderRadius: 5,
        padding: 5,
        paddingRight: 10,
        paddingLeft: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    valueDiv1choose: {
        width: 200,
        height: '100%',
        backgroundColor: '#2A2344',
        borderRadius: 5,
        padding: 5,
        paddingRight: 10,
        paddingLeft: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    balTitle: {
        color: 'white',
        lineHeight: 1,
        fontSize: 14
    },
    valDiv: {
        width: '100%',
        textAlign: 'center'
    },

    valueTxt: {
        fontSize: 16,
        background: "-webkit-linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        lineHeight: 1
    },
    roletxt: {
        color: 'white',
        fontSize: 14
    },
    architectdiv: {
        backgroundColor: '#6E56F8',
        borderRadius: 5,
        width: 72,
        height: 22,
        textAlign: 'center'
    },
    btnDiv: {
        display: 'flex',
        paddingLeft: 5,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    address: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    iconBtn: {
        color: 'white',
        padding: 0
    },
    dropitem: {
        textAlign: 'center',
        color: 'white',
        justifyContent: 'center'
    },
    dropdiv: {
        zIndex: 10
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    dialogDiv: {
        cursor: 'pointer',
        textAlign: 'center',
        textTransform: 'none',
        display: 'block',
    },
    dialogDivSelected: {
        textAlign: 'center',
        borderRadius: 6,
        cursor: 'pointer',
        textTransform: 'none',
        display: 'block',
    },
    contentDiv: {
        padding: 30,
        paddingLeft: 80,
        paddingRight: 80
    },
    btnDivrole: {
        padding: 20
    },
    changeBtn: {
        marginTop: 20,
        textTransform: 'none',
        textAlign: 'center'
    },
    roleDiv: {
        color: '#453A6B'
    },
    dialogHeader: {
        fontSize: 36,
        color: 'white',
    },
    dialogTitle: {
        textAlign: 'center'
    },
    borderDivSelected: {
        width: 300,
        height: 300,
        backgroundImage: `url(${roleback})`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 80,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        cursor: 'pointer'
    },
    borderDiv: {
        width: 300,
        height: 300,
        background: "#453A6B",
        backgroundImage: `url(${rolebackinactive})`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 80,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        cursor: 'pointer'
    },
    midDiv: {
        width: "100%",
        height: '100%',
        background: "#453A6B",
        borderRadius: 6,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectRoleSelected: {
        fontSize: 26,
    },
    selectRole: {
        fontSize: 24,
    },
    selectRoletxt: {
        fontSize: 24,
        marginTop: 23,
        textAlign: 'center'
    },
    btnChooseDiv: {
        width: '100%',
        textAlign: 'center',
    },
    detail: {
        textAlign: 'center',
        marginTop: 10
    },
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
        width: 'calc(100vw - 90px)',
        textAlign: 'center'
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
            background: 'linear-gradient(270deg, #8B63F3 -28.4%, #E8487F 167.84%) !important'
        },
        width: 300,
        height: 50,
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.75,
        borderRadius: 4,
        letterSpacing: '0.02857em'

    },
    homebtnDiv: {
        marginTop: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    homebtnSocial: {
    },
    exploreDiv: {
        display: 'flex',
        justifyContent: 'center'
    }
}));


function Header(props) {

    const { SystemProgram, Keypair } = web3;
    /* create an account  */

    const opts = {
        preflightCommitment: "processed"
    }
    const anchor = require('@project-serum/anchor');

    const dataFarmProgramID = new PublicKey('H6Sf4mP547Cv9M8UQ2rtdo6QiZ3c1sWJ36rj6orBhpuz');
    const stakingProgramID = new PublicKey('2DaSjv8BJP6wo3gtAMjCH6zswGfAStGQqMeRmRCHEiUV');

    const adminkey = new PublicKey('Be27aGNTTNfK7y2aeULJQiq9acQb4XJ9QYpNML8i1P3z');

    const SNS = new PublicKey("CdwBYzH8xrnWFaD78wUPiLy4PDc3TtHCACuEwANCJhkR");

    const kb_owner = Buffer.from(idJson)
    let owner = new anchor.web3.Account(kb_owner);
    console.log(owner);

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const [openRole, setOpenRole] = React.useState(false);
    const [selected, setSelected] = React.useState(store.getState().main.role);
    const [logout, setLogOut] = React.useState(false);

    const pool_flag = useSelector(state => state.main.pool_flag);

    const dispatch = useDispatch();
    const location = useLocation();

    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const classes = useStyles();
    const wallet = useWallet();
    const disconnect = useWallet();
    const [connected, setConnected] = React.useState(false);
    const [runflag, setRunFlag] = React.useState(false);
    const [valueSNS, setValueSNS] = React.useState(0)

    const splToken = require('@solana/spl-token');


    useEffect(() => {
        setSelected(store.getState().main.role)
    }, [store.getState().main.role])

    const handleClickOpen = () => {
        setOpenRole(true);
    };
    const handleRoleClose = () => {
        setOpenRole(false);
    };

    const handleSelectRole = (role) => {
        setSelected(role);
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const changeRole = () => {
        dispatch(setRole(selected));
        setOpenRole(false);
        if (selected === 0) {
            props.history.push('/architect')
        } else if (selected === 1) {
            props.history.push('/builder')
        } else {
            props.history.push('/validator')
        }
    }

    useEffect(() => {
        console.log('location.pathname', location.pathname)
        if (location.pathname === '/architect') {
            dispatch(setRole(0));
        } else if (location.pathname === '/builder') {
            dispatch(setRole(1));
        } else if (location.pathname === '/validator') {
            dispatch(setRole(2));
        } else {
            dispatch(setRole(-1));
        }
    }, [])


    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };
    const handleCloseRole = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpenRole(true);
        setOpen(false);

    };

    const handleCloseLogOut = async (event) => {
        if (anchorRef !== null) {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
                return;
            }
        }
        setLogOut(true)
        setOpen(false);
    };

    useEffect(() => {
        if (logout) {
            setItem('admin', null);
            removeItem('admin')
            setItem('pool_flag', false);
            dispatch(setPoolFlag(false))
            dispatch(setStakingProgram(null))
            dispatch(setProgram(null))
            setConnected(false)
            wallet.disconnect();
            props.history.push('/')
            window.location.reload();
        }
    }, [logout])

    const walletdisconnect = async () => {
        setConnected(false)
        await wallet.disconnect();
    }

    const CloseRole = () => {
        setOpenRole(false);
    }

    // return focus to the button when we transitioned from !open -> open




    useEffect(() => {
        window.solana.on("connect", () => setConnected(true));
        // return () => window.solana.disconnect();
    }, [])

    useEffect(() => {
        async function getProvider() {
            /* create the provider and return it to the caller */
            /* network set to local network for now */

            const user = Keypair.generate();
            let admin = Keypair.generate();
            const customer = Keypair.generate();
            const customerB = Keypair.generate();
            const architect = Keypair.generate();
            const architectB = Keypair.generate();
            const builder = Keypair.generate();
            const validator = Keypair.generate();
            const new_authority = Keypair.generate();


            const network = "https://api.devnet.solana.com";
            // const network = "http://127.0.0.1:8899";
            const connection = new Connection(network, opts.preflightCommitment);

            let balance = await connection.getBalance(wallet.publicKey);
            console.log(balance / LAMPORTS_PER_SOL);

            balance = await connection.getBalance(SNS);
            setValueSNS(balance / LAMPORTS_PER_SOL)

            console.log(balance / LAMPORTS_PER_SOL);

            //Airdrop SNS

            // anchor.setProvider(anchor.Provider.local("https://api.devnet.solana.com"));
            const provider = new Provider(
                connection, wallet, opts.preflightCommitment,
            );
            // anchor.setProvider(anchor.Provider.env())
            // const provider = anchor.getProvider();
            console.log("wallet address", wallet.publicKey.toBase58());
            const dataFarmProgram = new Program(dataFarmJson, dataFarmProgramID, provider);
            const stakingProgram = null;
            // let mint = await splToken.Token.createMint(provider.connection, owner, owner.publicKey, null, 9, splToken.TOKEN_PROGRAM_ID,)
            // let mint =  new PublicKey("tb1M1GPub1o4Wy6caa5G4R8tBHq2jpSkaSwEfxiRkgD"); 
            // let mint =  new PublicKey("CdwBYzH8xrnWFaD78wUPiLy4PDc3TtHCACuEwANCJhkR"); 
            console.log(idJson);
            let mint = await splToken.Token.createMint(provider.connection, owner, owner.publicKey, null, 9, splToken.TOKEN_PROGRAM_ID,)
            console.log("mint", mint);
            let architectToken = "";  //  await userCharge(mint, architect, owner);
            let builderToken = "";  // await userCharge(mint, builder, owner);
            let validatorToken = "";  // await userCharge(mint, validator, owner);
            // let poolVault = "";  // await poolVaultGen(mint, owner, owner);
            let poolVault = await vaultCharge(mint, admin, owner);
            console.log("poolVault", poolVault);

            dispatch(setInit(provider, user, admin, customer, customerB, architect, architectB, builder, validator, new_authority, SNS, dataFarmProgram, stakingProgram, owner, architectToken, builderToken, validatorToken, mint, poolVault, adminkey));

        }
        if (!runflag && wallet.connected && !wallet.disconnecting && !pool_flag) {
            setRunFlag(true);
            getProvider();
        }
    }, [wallet])

    const getstarted = (event) => {
        setOpenRole(true);
    }

    useEffect(() => {
        if (connected && wallet.publicKey !== null && selected === -1) {
            setOpenRole(true);
        }
    }, [wallet])
    return (
        <div>
            <div className={classes.root}>
                <Link className={classes.sideIcon} to='/'>
                    <img className={classes.imglogo} src={Logo} alt="logo"></img>
                </Link>
                {

                    !connected ? <div className={classes.balDiv1} >
                        <img src={walletimg} alt='wallet' className={classes.snsimg}></img>
                        <div className={classes.valueDiv1}>
                            <WalletModalButton className={classes.walletBtn} >Select Wallet</WalletModalButton>
                        </div>
                    </div> :
                        wallet.publicKey !== null && <div className={classes.headerDiv}>
                            <Button className={classes.btn} variant="contained" size="medium">Redeem rewards</Button>
                            <Button className={classes.btn1} variant="contained" size="medium">Get SNS</Button>
                            <div className={classes.balDiv}>
                                <img src={sns} alt='sns' className={classes.snsimg}></img>
                                <div className={classes.valueDiv}>
                                    <Typography className={classes.balTitle}>Wallet <br /> ballence:</Typography>
                                    <div className={classes.valDiv}>
                                        <Typography className={classes.valueTxt}>{valueSNS} SNS</Typography>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.balDiv1} ref={anchorRef}
                                aria-controls={open ? 'menu-list-grow' : undefined}
                                aria-haspopup="true"
                                onClick={handleToggle}>
                                <img src={walletimg} alt='wallet' className={classes.snsimg}></img>
                                <div className={location.pathname !== '/' ? classes.valueDiv1 : classes.valueDiv1choose}>
                                    {location.pathname !== '/' &&
                                        <div className={classes.architectdiv}>
                                            <Typography className={classes.roletxt}>{location.pathname === '/architect' ? 'Architect' : (location.pathname === '/builder' ? 'Builder' : 'Validator')}</Typography>
                                        </div>}
                                    <div className={classes.btnDiv}>
                                        <Typography className={classes.address}>{location.pathname === '/' ? 'Choose Role' : shortenAddress(wallet.publicKey.toBase58() || "")}</Typography>
                                    </div>
                                </div>
                            </div>
                            <Popper className={classes.dropdiv} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                    >
                                        <Paper className={classes.paper}>
                                            <ClickAwayListener onClickAway={handleClose}>
                                                <MenuList autoFocusItem={open} id="menu-list-grow" >
                                                    <MenuItem onClick={handleCloseRole} className={classes.dropitem}>Choose Role</MenuItem>
                                                    <MenuItem onClick={handleCloseLogOut} className={classes.dropitem}>Log out <ExitToAppIcon /></MenuItem>
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </div>

                }
                <Dialog scroll='body' onClose={handleRoleClose} PaperProps={{
                    style: {
                        backgroundColor: '#453A6B',
                        boxShadow: 'none',
                    },
                }} aria-labelledby="customized-dialog-title" open={openRole} maxWidth='lg'>
                    <DialogTitle disableTypography className={classes.dialogTitle}>
                        <Typography className={classes.dialogHeader}>Choose role</Typography>
                        <IconButton aria-label="close" className={classes.closeButton} onClick={CloseRole}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <div className={classes.contentDiv}>
                        <Grid container direction='row' justify="center"
                            alignItems="center">
                            <Grid className={classes.chooseDiv} item>
                                <div onClick={() => handleSelectRole(0)} className={selected === 0 ? classes.borderDivSelected : classes.borderDiv}>
                                    <div

                                        className={selected === 0 ? classes.dialogDivSelected : classes.dialogDiv}>
                                        <img src={architect} alt='architect'></img>
                                        <Typography className={selected === 0 ? classes.selectRoleSelected : classes.selectRole}>Architect</Typography>
                                    </div>
                                </div>

                            </Grid>
                            <Grid className={classes.chooseDiv} item>
                                <div onClick={() => handleSelectRole(1)} className={selected === 1 ? classes.borderDivSelected : classes.borderDiv}>
                                    <div
                                        className={selected === 1 ? classes.dialogDivSelected : classes.dialogDiv}>
                                        <img src={builder} alt='builder'></img>
                                        <Typography className={selected === 1 ? classes.selectRoleSelected : classes.selectRole}>Builder</Typography>
                                    </div>
                                </div>
                            </Grid>
                            <Grid className={classes.chooseDiv} item>
                                <div onClick={() => handleSelectRole(2)} className={selected === 2 ? classes.borderDivSelected : classes.borderDiv}>
                                    <div
                                        className={selected === 2 ? classes.dialogDivSelected : classes.dialogDiv}>
                                        <img src={validator} alt='validator'></img>
                                        <Typography className={selected === 2 ? classes.selectRoleSelected : classes.selectRole}>Validator</Typography>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                        <div className={classes.btnDivrole}>
                            <div className={classes.btnChooseDiv}>
                                <Button className={classes.changeBtn} size='large' onClick={changeRole} variant="contained" color="primary">Change Role</Button>
                            </div>
                        </div>

                    </div>
                </Dialog >

            </div >
            {
                location.pathname === '/' &&
                <div className={classes.homeroot}>
                    <img src={mark} alt='mark' className={classes.homeimgMark}></img>
                    <div className={classes.homemainDiv}>
                        <Typography className={classes.hometitle}>Synesis One Data <br /> Field Farming</Typography>
                        <div className={classes.exploreDiv}>
                            {
                                !connected ?
                                    <WalletModalButton className={classes.homeexploreBtn}>Let's explore Synesis One</WalletModalButton>
                                    :
                                    <Button onClick={getstarted} className={classes.homeexploreBtn}>Let's explore Synesis One</Button>
                            }
                        </div>

                        <Grid container className={classes.homebtnDiv} direction="row" spacing={3} justify='center' alignItems='center'>
                            <Grid item><img className={classes.homebtnSocial} src={twitter}></img></Grid>
                            <Grid item><img className={classes.homebtnSocial} src={linkedin}></img></Grid>
                            <Grid item><img className={classes.homebtnSocial} src={facebook}></img></Grid>
                            <Grid item><img className={classes.homebtnSocial} src={google}></img></Grid>
                        </Grid>
                    </div>
                </div>
            }
        </div>
    );
}



export default withRouter(Header)