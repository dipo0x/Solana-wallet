import { Coin } from '../modules/wallet/models/wallet.coin.model';
import { Network } from '../modules/wallet/models/wallet.coin.model';
import { Types } from 'mongoose';
import axios from "axios";
import { INetwork } from '../types/network/network.type';
import { ethers } from 'ethers';
import { solanaConnection } from '../config/solana.config';
import { PublicKey } from '@solana/web3.js';

export const calculateWalletWorth = async (
    walletId: Types.ObjectId
) => 
    {
    const totalWorth: { [key: string]: number } = {};
    let totalPortfolioValue = 0;
    const coins = await Coin.find({ walletId })
        .populate<{
            networks: INetwork[];
        }>({
            path: "networks",
            model: Network,
            select: "-privateAddress",
    })
    .lean(); 
    if(!coins){
        throw new Error('Invalid walletId provided');
    }

    for (const coin of coins) {
        console.log(`Fetching data for coin: ${coin.name} (${coin.symbol})`);
        let coinTotalWorth = 0;

        for (const network of coin.networks) {
            const balance = await getBalanceFromChain(network.publicAddress, network.name);

            const usdPrice = await getPriceInUSD(coin.name);
            const networkWorth = balance * usdPrice;

            coinTotalWorth += networkWorth;
        }

        totalWorth[coin.name] = coinTotalWorth;
        totalPortfolioValue += coinTotalWorth;
    }
    return { totalPortfolioValue, totalWorth };
}

const getPriceInUSD = async (symbol: string): Promise<number> => {
    const pricingApi = `https://api.coingecko.com/api/v3/simple/price`;
    try {
        const response = await axios.get(pricingApi, {
            params: {
                ids: symbol.toLowerCase(),
                vs_currencies: "usd"
            }
        });
        return response.data[symbol.toLowerCase()]?.usd || 0;
    } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error);
        return 0;
    }
};

const RPC_URLS: { [key: string]: string } = {
    Solana: process.env.SOLANA_RPC_URL!,
    Ethereum: process.env.ETHEREUM_RPC_URL!,
    Binance: process.env.BSC_RPC_URL!
};

// USDT Contract Addresses on Ethereum and BSC
const USDT_CONTRACT_ADDRESSES: { [key: string]: string } = {
    Ethereum: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    Binance: "0x55d398326f99059fF775485246999027B3197955",
};

/**
 * Fetch balance for Solana, Ethereum, Binance Smart Chain, and USDT.
 * @param publicAddress The wallet address.
 * @param networkName The network name (e.g., Solana, Ethereum, Binance, USDT).
 * @returns The balance in native tokens or USDT (as applicable).
 */
export const getBalanceFromChain = async (
    publicAddress: string,
    networkName: string
): Promise<number> => {
    try {
        if (networkName === "Solana") {
            const connection = await solanaConnection()
            const publicKey = new PublicKey(publicAddress);
            const balance = await connection.getBalance(publicKey);
            return balance / 1e9;
        }

        if (networkName === "Ethereum" || networkName === "Binance") {
            const rpcUrl = RPC_URLS[networkName];
            if (!rpcUrl) {
                throw new Error(`RPC URL not found for network: ${networkName}`);
            }

            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const balance = await provider.getBalance(publicAddress);
            return parseFloat(ethers.formatEther(balance));
        }

        if (networkName === "USDT") {
            const contractAddress =
                publicAddress.toLowerCase().includes("eth")
                    ? USDT_CONTRACT_ADDRESSES.Ethereum
                    : USDT_CONTRACT_ADDRESSES.Binance;

            const rpcUrl = publicAddress.toLowerCase().includes("eth")
                ? RPC_URLS.Ethereum
                : RPC_URLS.Binance;

            const provider = new ethers.JsonRpcProvider(rpcUrl);

            const usdtAbi = ["function balanceOf(address account) view returns (uint256)"];
            const usdtContract = new ethers.Contract(contractAddress, usdtAbi, provider);

            const balance = await usdtContract.balanceOf(publicAddress);
            return parseFloat(ethers.formatUnits(balance, 6))
        }

        throw new Error(`Unsupported network: ${networkName}`);
    } catch (error) {
        console.error(`Error fetching balance for ${networkName}:`, error);
        return 0;
    }
};
