import React, { useEffect, useCallback, useMemo } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link, withRouter } from "react-router-dom";
import { Button } from "@material-ui/core";
import { useLocation } from 'react-router-dom';
import { useWeb3React } from "@web3-react/core";
import { connectMetamaskWallet, connectSolletWallet, connectPhantomWallet, setInitialize } from '../../utils/Connect-contract';
import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import {
    Program, Provider, web3
} from '@project-serum/anchor';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Connection, PublicKey } from '@solana/web3.js';
import contractJson from '../../contracts/contracts.json'
import idjson from '../../contracts/id1.json'
import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { shortenAddress } from '../../utils/convert'



const solanaWeb3 = require("@solana/web3.js");


const useStyles = makeStyles((theme) => ({
    root: {
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
    }
}));


function Header(props) {

    const { SystemProgram, Keypair } = web3;
    /* create an account  */

    const opts = {
        preflightCommitment: "processed"
    }
    const anchor = require('@project-serum/anchor');

    const programID = new PublicKey('GWzBR7znXxEVDkDVgQQu5Vpzu3a5G4e5kPXaE9MvebY2');

    const SNS = new anchor.web3.PublicKey("51LAPRbcEvheteGQjSgAFV6rrEvjL4P2igvzPH8bu88");

    const [metamaskConnected, setMetamaskConnected] = React.useState(false);
    const [solletConnected, setSolletConnected] = React.useState(false);
    const [phantomConnected, setPhantomConnected] = React.useState(false);
    const [metamaskAddress, setMetamaskAddress] = React.useState("");
    const [solletAddress, setSolletAddress] = React.useState("");
    const [phantomAddress, setPhantomAddress] = React.useState("");
    const { library, active, account, chainId } = useWeb3React();
    const classes = useStyles();
    const wallet = useWallet();
    const { disconnect, disconnecting } = useWallet();
    const [connected, setConnected] = React.useState(false);


    const user = Keypair.generate();
    const admin = Keypair.generate();
    const customer = Keypair.generate();
    const architect = Keypair.generate();
    const builder = Keypair.generate();
    const validator = Keypair.generate();

    useEffect(() => {
        window.solana.on("connect", () => setConnected(true));
        return () => window.solana.disconnect();
    }, [])

    useEffect(() => {
        console.log('wallet', wallet)
    }, [wallet])


    let location = useLocation();

    async function getProvider() {
        /* create the provider and return it to the caller */
        /* network set to local network for now */
        console.log('wallet', wallet);
        const network = "https://api.devnet.solana.com";
        const connection = new Connection(network, opts.preflightCommitment);

        const balance = await connection.getBalance(wallet.publicKey);
        console.log(balance / LAMPORTS_PER_SOL);

        const provider = new Provider(
            connection, wallet, opts.preflightCommitment,
        );
        return provider;
    }

    useEffect(() => {
        setMetamaskConnected(active)
        setMetamaskAddress(account);
    }, []);

    const createMiningPool = async () => {

        const provider = await getProvider()
        console.log('provider', provider)
        const program = new Program(contractJson, programID, provider);
        console.log('program', program)

        const architect_stake = new anchor.BN(20);
        const builder_stake = new anchor.BN(20);
        const validator_stake = new anchor.BN(20);
        const reward_apy = 10;
        const pool_cap = new anchor.BN(250000000);
        const penalty = new anchor.BN(2);

        try {
            const transaction = await program.rpc.initPool(
                architect_stake, builder_stake, validator_stake,
                reward_apy, pool_cap, penalty,
                {
                    accounts: {
                        poolAccount: 'HPUUVAQa13Ui6QNaHLz71BVD3zB2agxkFAEPutt2j8ve',
                        poolAuthority: user.publicKey,
                        sns: SNS
                    },
                    signers: [admin],
                    instructions: [await program.account.poolAccount.createInstruction(admin)],

                });
            const pool = await program.account.poolAccount.fetch('HPUUVAQa13Ui6QNaHLz71BVD3zB2agxkFAEPutt2j8ve');
            console.log('pool', pool);
        } catch (err) {
            console.log(" ", err);
        }
    }

    const updateMiningPool = async () => {


        const provider = await getProvider()
        console.log('provider', provider)
        const program = new Program(contractJson, programID, provider);
        console.log('program', program)

        const previous_pool = await program.account.poolAccount.fetch('HPUUVAQa13Ui6QNaHLz71BVD3zB2agxkFAEPutt2j8ve');
        const newApy = 13;

        try {
            const transaction = await program.rpc.updatePool(newApy,
                {
                    accounts: {
                        poolAccount: 'HPUUVAQa13Ui6QNaHLz71BVD3zB2agxkFAEPutt2j8ve',
                        newAuthority: 'HPUUVAQa13Ui6QNaHLz71BVD3zB2agxkFAEPutt2j8ve'
                    },
                    signers: [admin]
                });
            const pool = await program.account.poolAccount.fetch('HPUUVAQa13Ui6QNaHLz71BVD3zB2agxkFAEPutt2j8ve');
            console.log('pool', pool);
        } catch (err) {
            console.log(" ", err);
        }
    }

    const createCampaign = async () => {

        const provider = await getProvider()
        console.log('provider', provider)
        const program = new Program(contractJson, programID, provider);
        console.log('program', program)

        const pool = await program.account.poolAccount.fetch('HPUUVAQa13Ui6QNaHLz71BVD3zB2agxkFAEPutt2j8ve');
        const offChainReference = new anchor.BN(1213);
        const period = new anchor.BN(14);
        const min_builder = new anchor.BN(5);
        const min_validator = new anchor.BN(5);
        const title = "first campaign";
        const description = "create data set for support system";
        const reward_per_utterance = new anchor.BN(2);
        const validation_quorum = 64;

        try {
            const transaction = await program.rpc.createCampaign(
                offChainReference,
                period,
                min_builder,
                min_validator,
                title,
                description,
                reward_per_utterance,
                validation_quorum,
                {
                    accounts: {
                        campaign: customer.publicKey,
                        pool: 'HPUUVAQa13Ui6QNaHLz71BVD3zB2agxkFAEPutt2j8ve'
                    },
                    instructions: [
                        await program.account.campaignAccount.createInstruction(customer),
                    ],
                    signers: [customer],
                });
            const campaign = await program.account.campaignAccount.fetch(customer.publicKey);
            console.log('pool', campaign);
        } catch (err) {
            console.log(" ", err);
        }
    }


    const architectInit = async () => {

        const provider = await getProvider()
        console.log('provider', provider)
        const program = new Program(contractJson, programID, provider);
        console.log('program', program)

        const pool = await program.account.poolAccount.fetch('HPUUVAQa13Ui6QNaHLz71BVD3zB2agxkFAEPutt2j8ve');
        const campaign = await program.account.campaignAccount.fetch(customer.publicKey);
        const stake_amount = new anchor.BN(1000);
        const stake_period = new anchor.BN(7);

        try {
            const transaction = await program.rpc.architectInit(
                stake_amount,
                stake_period,
                {
                    accounts: {
                        ontologyAccount: architect.publicKey,
                        architect: architect.publicKey,
                        campaign: customer.publicKey,
                        pool: 'HPUUVAQa13Ui6QNaHLz71BVD3zB2agxkFAEPutt2j8ve',
                    },
                    instructions: [
                        await program.account.ontologyAccount.createInstruction(architect),
                    ],
                    signers: [architect],
                });
            const ontology = await program.account.ontologyAccount.fetch(architect.publicKey);

            console.log('pool', ontology);
        } catch (err) {
            console.log(" ", err);
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.buttonBox}>
                <div >
                    <WalletMultiButton />
                </div>
                {/* {wallet.publicKey !== null && (
                    <>
                        <p>Address: {shortenAddress(wallet.publicKey.toBase58() || "")}</p>
                        <Button className={classes.walletButton} variant="contained" onClick={createMiningPool}>
                            createMiningPool
                        </Button>
                        <Button className={classes.walletButton} variant="contained" onClick={updateMiningPool}>
                            updateMiningPool
                        </Button>
                        <Button className={classes.walletButton} variant="contained" onClick={createCampaign}>
                            createCampaign
                        </Button>
                        <Button className={classes.walletButton} variant="contained" onClick={architectInit}>
                            architectInit
                        </Button>
                    </>
                )
                } */}
            </div>
        </div>
    );
}



export default Header