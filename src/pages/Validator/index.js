import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Button, IconButton, CircularProgress, Typography, Paper, InputBase } from "@material-ui/core";
import CampaignHeader from '../../components/Common/campaignHeader';
import { StyledTab, StyledTabs } from '../../components/Common/StyledTabs';
import SearchIcon from '@material-ui/icons/Search';
import AvailableTable from '../../components/Validator/AvailableTable';
import SubscribedTable from '../../components/Validator/SubscribedTable';
import { useDispatch, useSelector } from "react-redux";

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
    header: {
        display: 'flex',
        marginTop: '24px',
        marginLeft: '24px',
        [theme.breakpoints.down('sm')]: {
            display: 'block'
        },
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
    tabMain: {
    },
    buttons: {
        width: 200,
        height: 50,
        margin: 30
    },
    progress: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 30
    }
}));

const Validator = (props) => {

    const classes = useStyles();

    const admin = useSelector(state => state.main.admin);
    const customer = useSelector(state => state.main.customer);
    const program = useSelector(state => state.main.program);

    const [active_data, setActiveData] = React.useState([]);
    const [available_data, setAvailableData] = React.useState([]);
    const adminkey = useSelector(state => state.main.adminkey);

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

    const setIndex = (index) => {
        let active = [...active_data];
        active[index].validateIndex = active[index].validateIndex + 1;
        setActiveData([...active]);
    }


    async function getList() {
        try {
            console.log("program", program)
            // const pool = await program.account.poolAccount.fetch(adminkey);
            const pool = await program.state.fetch();
            console.log('pools', pool)
            let campaigns = pool.campaigns;

            setActiveData([]);
            setAvailableData([]);
            let temp = [];
            let temp1 = [];
            console.log("pool.head", pool.head)

            for (let z = 0; z < pool.head; z++) {
                console.log("program", program);
                console.log("campaignAccount", program.account.campaignAccount);
                const campaignAddr = await program.account.campaignAccount.associatedAddress(campaigns[z]);
                console.log("architect ", campaigns[z].toBase58(), "\tcreated campaign ", campaignAddr.toBase58());
                console.log("campaigns ", campaigns[z]);
                const campaign = await program.account.campaignAccount.fetch(campaigns[z].toBase58());
                console.log("campaign ", campaign);
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
                    architectStakeAmount: campaign.architectStakeAmount.words[campaign.architectStakeAmount.length - 1],
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
                temp.push(data);
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
        } else {
            setLoading(true)
        }
    }, [program])


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <CampaignHeader />
            <div className={classes.tabs}>
                <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
                    <StyledTab label="Subscribed" />
                    <StyledTab label="Available" />
                </StyledTabs>
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
            </div>
            {
                loading ? <div className={classes.progress}><CircularProgress /></div> : value === 0 ? <SubscribedTable
                    setIndex={setIndex}
                    active_data={searchValue.length === 0 ? active_data : active_data.filter(item => item.topic.includes(searchValue))} getList={getList} />
                    : <AvailableTable available_data={searchValue.length === 0 ? available_data : available_data.filter(item => item.topic.includes(searchValue))} getList={getList} />
            }
        </div>
    )
}

export default Validator;