import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import theme from "../../utils/theme";
import { Typography, Grid, Button, TextField } from '@material-ui/core';
import { withRouter, useLocation } from 'react-router-dom';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        minHeight: 'calc(100vh - 103px)',
        backgroundColor: '#332B4F',
        padding: '30px 45px',
    },
    backbutton: {
        color: 'white',
        marginBottom: 20
    },
    inputfield: {
        "& .MuiFilledInput-root": {
            background: "white"
        }
    },
    title: {
        color: 'white',
        marginBottom: 10
    },
    inputdivs: {
        marginBottom: 20
    },
    btn: {
        textTransform: 'none'
    }
}));

const StakeCampaign = (props) => {

    const architect = useSelector(state => state.main.architect);
    const dataFarmProgram = useSelector(state => state.main.program);
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

    const stakeCampaign = async () => {
        const campaignAddr = await dataFarmProgram.account.campaignAccount.associatedAddress(architect.publicKey);
        myAccount = anchor.web3.Keypair.generate();
        await stakingProgram.rpc.stake(
            {
                accounts: {
                    stakeAccount: myAccount.publicKey,
                    user: architect.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    userToken: architectToken.address,
                    cpiState: dataProgram.state.address(),
                    datafarm: dataProgram.programId,
                    campaign: campaignAddr,
                    poolVault: pool_vault.address,
                    tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
                    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                },
                instructions: [
                    await stakingProgram.account.stakeAccount.createInstruction(myAccount),
                ],
                signers: [myAccount, architect],
            });
        const stake = await stakingProgram.account.stakeAccount.fetch(myAccount.publicKey);
    }

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Button
                onClick={() => props.history.push('architect')}
                className={classes.backbutton}
                startIcon={<KeyboardBackspaceIcon />}
            >
                Back to campaigns
            </Button>
            <Grid className={classes.inputdivs} container spacing={3}>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Organizer</Typography>
                    <TextField value="XYZ Corp" className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={3}>
                    <Typography className={classes.title}>Topic domain</Typography>
                    <TextField value="Insurance" className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={3}>
                    <Typography className={classes.title}>Topic subject</Typography>
                    <TextField value="rates" className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
            </Grid>
            <Grid className={classes.inputdivs} container spacing={3}>
                <Grid item xs={12}>
                    <Typography className={classes.title}>Topic subject</Typography>
                    <TextField value='This campaign to help XYZ corp better engage with users/customers about insurance rates, specifically the differences between flat and usage-based rates' className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
            </Grid>
            <Grid className={classes.inputdivs} container spacing={3}>
                <Grid item xs={12}>
                    <Typography className={classes.title}>Example seed phrases</Typography>
                    <TextField value='With my current usage, what is my monthly rate with the usage-based plan? 
How much will I save with a usage-based plan? 
Can I switch back to a flat rate plan?' className={classes.inputfield} id="outlined-basic" size='small' multiline={true}
                        rows={3} fullWidth variant="outlined" />
                </Grid>
            </Grid>
            <Grid className={classes.inputdivs} container spacing={3}>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Reward per utterance (SNS)</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Required utterances (items)</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
            </Grid>
            <Grid className={classes.inputdivs} container spacing={3}>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Time limit (days)</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Fixed Reward (%)</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
            </Grid>
            <Grid className={classes.inputdivs} container spacing={3}>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Mining Reward (%)</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Minimum Validations (# of utterances)</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
            </Grid>
            <Grid className={classes.inputdivs} container spacing={3}>
                <Grid item xs={6}>
                    <Typography className={classes.title}>Validation Quorum (% of total)</Typography>
                    <TextField className={classes.inputfield} id="outlined-basic" size='small' fullWidth variant="outlined" />
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={3}
            >
                <Grid item>
                    <Button className={classes.btn} onClick={() => props.history.push('architect')}>
                        Cancel
                    </Button></Grid>
                <Grid item>
                    <Button className={classes.btn} variant='contained' color='primary' onClick={stakeCampaign}>
                        Stake campaign
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default withRouter(StakeCampaign);