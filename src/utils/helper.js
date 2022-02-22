const anchor = require("@project-serum/anchor");
const common = require("@project-serum/common");
const { BN } = anchor;
const { Keypair, PublicKey, SystemProgram, Transaction } = anchor.web3;
const splToken = require('@solana/spl-token');

const Token = require("@solana/spl-token").Token;
const TOKEN_PROGRAM_ID = require("@solana/spl-token").TOKEN_PROGRAM_ID;
const TokenInstructions = require("@project-serum/serum").TokenInstructions;


export const setItem = (key, item) => { // set session
    if (item) {
        window.localStorage.setItem(key, item);
    } else {
        window.localStorage.removeItem(key);
    }
}

export const getItem = (key) => {       // get session
    if (key) {
        return window.localStorage.getItem(key);
    }
}

export const removeItem = (key) => { // set session
    window.localStorage.removeItem(key)
}

export const userCharge = async (mint, owner, authority) => {
    const tokenAccount = await mint.getOrCreateAssociatedAccountInfo(owner.publicKey);

    await mint.mintTo(
        tokenAccount.address,
        authority,
        [],
        1000_000_000_000 // 1 followed by decimals number of 0s // You'll ask the creator ki how many decimals he wants in his token. If he says 4, then 1 token will be represented as 10000
    );
    const account = await mint.getOrCreateAssociatedAccountInfo(owner.publicKey);
    return account
};

export const vaultCharge = async (mint, owner, authority) => {
    const tokenAccount = await mint.getOrCreateAssociatedAccountInfo(owner.publicKey);
    await mint.mintTo(
        tokenAccount.address,
        authority,
        [],
        1000_000_000_000_000 // 1 followed by decimals number of 0s // You'll ask the creator ki how many decimals he wants in his token. If he says 4, then 1 token will be represented as 10000
    );
    const account = await mint.getOrCreateAssociatedAccountInfo(owner.publicKey);
    return account
};

export const poolVaultGen = async (mint, owner, authority) => {
    const tokenAccount = await mint.getOrCreateAssociatedAccountInfo(owner.publicKey);
    return tokenAccount
};