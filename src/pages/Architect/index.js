import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Button, IconButton, Tab, Typography, Paper, InputBase, Grid, Dialog, DialogTitle, TextField, CircularProgress, Select } from "@material-ui/core";
import CampaignHeader from '../../components/Common/campaignHeader';
import { StyledTab, StyledTabs } from '../../components/Common/StyledTabs';
import SearchIcon from '@material-ui/icons/Search';
import { withRouter, useLocation } from "react-router-dom"
import ActivatedTable from '../../components/Architect/ActivatedTable';
import AvailableTable from '../../components/Architect/AvailableTable';
import CloseIcon from '@material-ui/icons/Close';
import store from '../../redux';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        minHeight: 'calc(100vh - 103px)',
        backgroundColor: '#332B4F',
        padding: '30px 45px',
    },
    padding: {
        padding: theme.spacing(3),
    },
    contentDiv: {
        paddingLeft: 90,
        paddingRight: 90,
        paddingBottom: 40,
        paddingTop: 20,
    },
    header: {
        display: 'flex',
        marginTop: '24px',
        marginLeft: '24px',
        [theme.breakpoints.down('sm')]: {
            display: 'block'
        },
    },
    tabMain: {
    },
    buttons: {
        width: 200,
        height: 50,
        margin: 30
    },
    tabs: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 20
    },
    paper: {
        padding: '2px 5px',
        display: 'flex',
        alignItems: 'center',
        width: 300,
        backgroundColor: '#231C3D',
        borderColor: '#17122B',
        border: '1px solid #17122B',
        marginRight: 20
    },
    iconButton: {
        padding: 10,
        color: 'white'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        color: 'white'
    },
    searchDiv: {
        display: 'flex'
    },
    newBtn: {
        textTransform: 'none',
        color: 'white',
        paddingLeft: 20,
        paddingRight: 20,
        background: 'linear-gradient(90deg, #8B63F3 -11.75%, #E8487F 105.01%)',
        '&:hover': {
            background: 'linear-gradient(270deg, #8B63F3 -28.4%, #E8487F 167.84%)'
        }
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
        marginTop: 40,
        background: 'linear-gradient(90deg, #8B63F3 -11.75%, #E8487F 105.01%)',
        '&:hover': {
            background: 'linear-gradient(270deg, #8B63F3 -28.4%, #E8487F 167.84%)'
        },
        color: 'white',
    },
    btns1: {
        textTransform: 'none',
        color: 'white',
        borderColor: 'white',
        width: 200,
        marginTop: 40
    },
    inputfield: {
        color: 'white',
        border: '1px solid #60548B',
        "& > .Mui-disabled": {
            color: "white"
        }
    },
    progress: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 30
    }
}));



const Architect = (props) => {

    const classes = useStyles();

    const architect = useSelector(state => state.main.architect);
    const program = useSelector(state => state.main.program);
    const stakingProgram = useSelector(state => state.main.stakingProgram);
    const adminkey = useSelector(state => state.main.adminkey);
    const architectToken = useSelector(state => state.main.architectToken);
    const mint = useSelector(state => state.main.mint);
    const poolVault = useSelector(state => state.main.poolVault);
    const TokenInstructions = require("@project-serum/serum").TokenInstructions;

    const [active_data, setActiveData] = React.useState([]);
    const [available_data, setAvailableData] = React.useState([]);

    const [open, setOpen] = React.useState(false);

    const anchor = require('@project-serum/anchor');

    const [value, setValue] = React.useState(1);

    const [searchValue, setSearchValue] = React.useState('')

    const [loading, setLoading] = React.useState(true)

    const searchEnterClick = (event) => {
        if (event.keyCode == 13) {
            event.preventDefault();
            setSearchValue(event.target.value)
            // put the login here
        }
    }

    const searchChange = (event) => {
        setSearchValue(event.target.value)
    }

    async function getList() {
        try {
            console.log(program.state)
            console.log(program.account.stakeAccount)
            const pool = await program.state.fetch();
            console.log('pool', pool)
            let campaigns = pool.campaigns;

            setActiveData([]);
            setAvailableData([]);
            let temp = [];
            let temp1 = [];


            for (let z = 0; z < pool.head; z++) {
                const campaignAddr = await program.account.campaignAccount.associatedAddress(campaigns[z]);
                console.log("architect ", campaigns[z].toBase58(), "\tcreated campaign ", campaignAddr.toBase58());
                console.log("campaigns ", campaigns[z]);

                const campaign = await program.account.campaignAccount.fetch(campaigns[z].toBase58());
                console.log("campaign ", campaign);
                // const stake = await stakingProgram.account.stakeAccount.fetch(campaign.architect);
                // console.log("stake", stake);
                let utters = campaign.utterances.filter(item => item.data[0] !== 0);
                let data = {
                    index: z,
                    organizer: 'mind.ai',
                    publicKey: campaigns[z].toBase58(),
                    topic: new TextDecoder().decode(Uint8Array.from(campaign.subject.filter(item =>
                        item !== 0))) + ' / ' + new TextDecoder().decode(Uint8Array.from(campaign.domain.filter(item =>
                            item !== 0))),
                    explain: new TextDecoder().decode(Uint8Array.from(campaign.explain.filter(item =>
                        item !== 0))),
                    phrase: new TextDecoder().decode(Uint8Array.from(campaign.phrase.filter(item =>
                        item !== 0))),
                    status: utters.filter(item => !item.finish).length,
                    progress: '',
                    remain: '',
                    // architectStakeAmount: campaign.architectStakeAmount.words[campaign.architectStakeAmount.length - 1],
                    rewardPerBuilder: campaign.rewardPerBuilder.words[campaign.rewardPerBuilder.length - 1],
                    rewardPerValidator: campaign.rewardPerValidator.words[campaign.rewardPerValidator.length - 1],
                    minBuilder: campaign.minBuilder.words[campaign.minBuilder.length - 1],
                    minValidator: campaign.minValidator.words[campaign.minValidator.length - 1],
                    validationQuorum: campaign.validationQuorum,
                    penalty: pool.penalty.words[pool.penalty.length - 1],
                    timeLimit: campaign.timeLimit.words[campaign.timeLimit.length - 1],
                    initLimit: campaign.initLimit.words[campaign.initLimit.length - 1],
                    utterances: utters,
                    apy: pool.rewardApy,
                    validateIndex: 0
                };
                // if (data.architectStakeAmount > 0) {
                //     temp.push(data);
                // } else {
                //     temp1.push(data);
                // }
                // temp.push(data);
                temp1.push(data);
            }

            setActiveData(temp);
            setAvailableData(temp1);
            setLoading(false)
        } catch (error) {
            console.log('error', error)
        }
    }
    useEffect(() => {

        if (program != null) {
            getList();
            getRequestedTopic();
        } else {
            setLoading(true)
        }
    }, [program])

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [values, setValues] = React.useState({
        organizer: '',
        t_domain: '',
        t_subject: '',
        t_description: '',
        example: '',
        u_reward: '',
        u_required: '10',
        limit: '',
        fixed_reward: '',
        mining_reward: '',
        min_validator: '2',
        quorum: ''
    });

    const handleInputChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const getRequestedTopic = () => {
        axios.get('http://ec2-35-85-254-111.us-west-2.compute.amazonaws.com:8008/get-topics')
            .then((response) => {
                console.log(response.data);
                console.log(response.status);
                console.log(response.statusText);
                console.log(response.headers);
                console.log(response.config);
            });
    }

    const createCampaign = async () => {

        const offChainReference = new anchor.BN(1213);
        const period = new anchor.BN(values.limit);
        const min_builder = new anchor.BN(5);
        const min_validator = new anchor.BN(values.min_validator);
        const reward_per_builder = new anchor.BN(values.u_reward);
        const reward_per_validator = new anchor.BN(values.u_required);
        const validation_quorum = values.quorum;
        const topic_domain = values.t_domain;
        const topic_subject = values.t_subject;
        const topic_explain = values.t_description;
        const seed_phrase = values.example;
        const campaignAccount = anchor.web3.Keypair.generate();
        console.log("program.account", program.account.campaignAccount)

        try {
            await program.state.rpc.createCampaign(
                offChainReference,
                period,
                min_builder,
                min_validator,
                reward_per_builder,
                reward_per_validator,
                validation_quorum,
                topic_domain,
                topic_subject,
                topic_explain,
                seed_phrase,
                {
                    accounts: {
                        // campaign: architect.publicKey,
                        // architect: architect.publicKey,
                        // pool: adminkey,
                        // architectToken: architectToken.address,
                        // snsMint: mint.publicKey,
                        // poolVault: poolVault.address,
                        // tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
                        campaignAccount: campaignAccount.publicKey,
                        architect: architect.publicKey,
                        pool: program.state.address(),
                        datafarm: program.programId,
                        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,

                    },
                    instructions: [
                        await program.account.campaignAccount.createInstruction(campaignAccount),
                    ],
                    signers: [architect, campaignAccount],
                });
            const campaign = await program.account.campaignAccount.fetch(campaignAccount.publicKey);
            const campaignAddr = await program.account.campaignAccount.associatedAddress(campaignAccount.publicKey);
            console.log("\tcampaign address ", campaignAddr.toBase58());
            console.log('campaign', campaign);
            setOpen(false);
            getList();
            const keyFields = {
                organizer: '',
                t_domain: '',
                t_subject: '',
                t_description: '',
                example: '',
                u_reward: '',
                u_required: '',
                limit: '',
                fixed_reward: '',
                mining_reward: '',
                min_validator: '',
                quorum: ''
            };
            setValues(keyFields);
        } catch (error) {
            console.log('err', error)
            alert(error)
        }
    }

    return (
        <div className={classes.root}>
            <CampaignHeader />
            <div className={classes.tabs}>
                <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
                    <StyledTab label="Activated" />
                    <StyledTab label="Available" />
                </StyledTabs>
                <div className={classes.searchDiv}>
                    <Paper component="form" className={classes.paper}>
                        <InputBase
                            value={searchValue}
                            className={classes.input}
                            placeholder="Search..."
                            inputProps={{ 'aria-label': 'Search...' }}
                            onKeyDown={searchEnterClick}
                            onChange={searchChange}
                        />
                        <IconButton className={classes.iconButton} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                    <Button variant="contained" onClick={handleClickOpen} className={classes.newBtn}>Create new campaign</Button>
                </div>
            </div>
            {
                loading ? <div className={classes.progress}><CircularProgress /></div>
                    : value === 0 ?
                        <ActivatedTable
                            active_data={searchValue.length === 0 ? active_data : active_data.filter(item => item.topic.includes(searchValue))}
                            getList={getList}
                        />
                        :
                        <AvailableTable
                            available_data={searchValue.length === 0 ? available_data : available_data.filter(item => item.topic.includes(searchValue))}
                            getList={getList}
                            active_data={active_data}
                            setActiveData={setActiveData}
                        />
            }
            <Dialog scroll='body' onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}
                PaperProps={{
                    style: {
                        backgroundColor: '#453A6B',
                        boxShadow: 'none',
                    },
                }} maxWidth='md'>
                <DialogTitle disableTypography>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <div className={classes.contentDiv}>
                    <Typography className={classes.detailtxt}>Create Campaign</Typography>
                    <div className={classes.divider} />
                    <Grid className={classes.inputdivs} container spacing={3}>
                        <Grid item xs={6}>
                            <Typography className={classes.title}>Requested Topics</Typography>
                            {/* <Select onChange={handleInputChange('organizer')}>
                                <option>eCommerce </option>
                                <option>mind.io</option>
                            </Select> */}
                            <TextField value='mind.io' onChange={handleInputChange('organizer')}
                                InputProps={{
                                    className: classes.inputfield
                                }} id="outlined-basic" size='small' fullWidth variant="outlined" disabled />
                        </Grid>
                        <Grid item xs={3}>
                            <Typography className={classes.title}>Topic domain</Typography>
                            <TextField value={values.t_domain} onChange={handleInputChange('t_domain')}
                                InputProps={{
                                    className: classes.inputfield
                                }} id="outlined-basic" size='small' fullWidth variant="outlined" />
                        </Grid>
                        <Grid item xs={3}>
                            <Typography className={classes.title}>Topic subject</Typography>
                            <TextField value={values.t_subject} onChange={handleInputChange('t_subject')}
                                InputProps={{
                                    className: classes.inputfield
                                }} id="outlined-basic" size='small' fullWidth variant="outlined" />
                        </Grid>
                    </Grid>
                    <Grid className={classes.inputdivs} container spacing={3}>
                        <Grid item xs={12}>
                            <Typography className={classes.title}>Organizer</Typography>
                            <TextField value='mind.io' onChange={handleInputChange('organizer')}
                                InputProps={{
                                    className: classes.inputfield
                                }} id="outlined-basic" size='small' fullWidth variant="outlined" disabled />
                        </Grid>
                    </Grid>
                    <Grid className={classes.inputdivs} container spacing={3}>
                        <Grid item xs={6}>
                            <Typography className={classes.title}>Topic explanation</Typography>
                            <TextField value={values.t_description} onChange={handleInputChange('t_description')}
                                multiline={true}
                                rows={3}
                                InputProps={{
                                    className: classes.inputfield
                                }} id="outlined-basic" size='small' fullWidth variant="outlined" />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography className={classes.title}>Example seed phrases</Typography>
                            <TextField value={values.example} onChange={handleInputChange('example')}
                                InputProps={{
                                    className: classes.inputfield
                                }} id="outlined-basic" size='small' multiline={true}
                                rows={3} fullWidth variant="outlined" />
                        </Grid>
                    </Grid>
                    <Grid className={classes.inputdivs} container spacing={3}>
                        <Grid item xs={6}>
                            <Typography className={classes.title}>Reward per utterance (SNS)</Typography>
                            <TextField value={values.u_reward} onChange={handleInputChange('u_reward')}
                                type='number' InputProps={{
                                    className: classes.inputfield
                                }} id="outlined-basic" size='small' fullWidth variant="outlined" />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography className={classes.title}>Required utterances (items)</Typography>
                            <TextField value={values.u_required} onChange={handleInputChange('u_required')}
                                type='number' InputProps={{
                                    className: classes.inputfield
                                }} id="outlined-basic" size='small' fullWidth variant="outlined" />
                        </Grid>
                    </Grid>
                    <Grid className={classes.inputdivs} container spacing={3}>
                        <Grid item xs={6}>
                            <Typography className={classes.title}>Time limit (days)</Typography>
                            <TextField value={values.limit} onChange={handleInputChange('limit')}
                                type='number' InputProps={{
                                    className: classes.inputfield
                                }} id="outlined-basic" size='small' fullWidth variant="outlined" />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography className={classes.title}>Fixed Reward (%)</Typography>
                            <TextField value={values.fixed_reward} InputProps={{
                                className: classes.inputfield
                            }} onChange={handleInputChange('fixed_reward')}
                                type='number' className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                        </Grid>
                    </Grid>
                    <Grid className={classes.inputdivs} container spacing={3}>
                        <Grid item xs={6}>
                            <Typography className={classes.title}>Minimum Validations (# of utterances)</Typography>
                            <TextField value={values.min_validator} onChange={handleInputChange('min_validator')}
                                type='number' InputProps={{
                                    className: classes.inputfield
                                }} id="outlined-basic" size='small' fullWidth variant="outlined" />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography className={classes.title}>Validation Quorum (% of total)</Typography>
                            <TextField value={values.quorum} onChange={handleInputChange('quorum')}
                                type='number' InputProps={{
                                    className: classes.inputfield
                                }} id="outlined-basic" size='small' fullWidth variant="outlined" />
                        </Grid>
                    </Grid>
                    <Grid container direction='row' justify="center" spacing={3}
                        alignItems="center" className={classes.valuedivs}>
                        <Grid item>
                            <Button className={classes.btns1} onClick={handleClose} variant='outlined' size='large'>Cancel</Button>
                        </Grid>
                        <Grid item >
                            <Button className={classes.btns} onClick={createCampaign} variant='contained' size='large'>Create campaign</Button>
                        </Grid>
                    </Grid>
                </div>
            </Dialog>

        </div>
    )
}

export default withRouter(Architect);