import { Connection, PublicKey } from "@solana/web3.js";
import { solanaConnection } from '../../config/solana.config';
import ITransaction from "../../types/transaction/transaction.type";


const getTransactionSignatures = async (
    walletAddress: string,
    limit?: number
) => {
    limit = limit ? limit : 1000
    const connection = await solanaConnection()
    const publicKey = new PublicKey(walletAddress);
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: limit });
    return signatures;
};

const getTransactionDetails = async (connection: Connection, signature: string) => {
    const transaction = await connection.getTransaction(signature, { commitment: "finalized" });
    return transaction;
};

const calculateBalanceChange = (transaction: any, walletAddress: string) => {
    const accountIndex = transaction.transaction.message.accountKeys.findIndex(
        (key: any) => key.toBase58() === walletAddress
    );

    if (accountIndex !== -1) {
        const preBalance = transaction.meta.preBalances[accountIndex];
        const postBalance = transaction.meta.postBalances[accountIndex];
    return postBalance - preBalance;
    }
    return 0;
};

export const calculateSolanaBalance24HoursAgo = async (walletAddress: string) => {
    const connection = await solanaConnection()

    const currentTime = Math.floor(Date.now() / 1000);
    const timestamp24HoursAgo = currentTime - 24 * 60 * 60;

    const signatures = await getTransactionSignatures(walletAddress);

    let balance24HoursAgo = 0;
    const relevantTransactions = [];

    for (const signatureInfo of signatures) {
        const transaction = await getTransactionDetails(connection, signatureInfo.signature);

        if (transaction?.blockTime && transaction.blockTime < timestamp24HoursAgo) {
        relevantTransactions.push(transaction);
        }
    }
    for (const tx of relevantTransactions) {
        balance24HoursAgo += calculateBalanceChange(tx, walletAddress);
    }

    return balance24HoursAgo / 1e9;
};

export const getTransactionDetailsWithAmount = async (walletAddress: string) :Promise<ITransaction[]>  => {
    const transactionsArray : ITransaction[] = []
    const connection = await solanaConnection()
    const signatures = await getTransactionSignatures(walletAddress, 10);

    for (const signatureInfo of signatures) {
        const transaction = await getTransactionDetails(connection, signatureInfo.signature);

        if (transaction) {
            const accountIndex = transaction.transaction.message.accountKeys.findIndex(
                (key) => key.toBase58() === walletAddress
            );

            if (accountIndex !== -1) {
                const preBalance = transaction.meta?.preBalances[accountIndex] ?? 0;
                const postBalance = transaction.meta?.postBalances[accountIndex] ?? 0;
                const amount = (postBalance - preBalance) / 1e9;
                const blockTime = transaction.blockTime;
                const date = new Date((blockTime ?? 0) * 1000);

                const transactionData = {
                    amount: `${amount} SOL`,
                    date: date.toLocaleDateString(),
                    time: date.toLocaleTimeString()
                }
                transactionsArray.push(transactionData);
            }
        }
    }
    return transactionsArray
};