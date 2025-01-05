import { Connection } from "@solana/web3.js";

const DEVNET_URL = process.env.SOLANA_RPC_URL!

export const solanaConnection = async () => {
    const connection = new Connection(DEVNET_URL, "confirmed");
    return connection
}