import { Coin } from '../modules/wallet/models/wallet.coin.model';
import { Network } from '../modules/wallet/models/wallet.coin.model';
import { Types } from 'mongoose';
import axios from "axios";
import { INetwork } from '../types/network/network.type';
import { ethers } from 'ethers';
import { solanaConnection } from '../config/solana.config';
import { PublicKey } from '@solana/web3.js';
import { JsonRpcProvider } from 'ethers';
import { formatEther } from 'ethers'; 

export const calculateWalletWorth = async (
    walletId: Types.ObjectId
) => 
    {
    const totalWorth: { [key: string]: { coinTotalWorth: number, balance: number } } = {};
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
        let coinTotalWorth = 0;
        let totalCoinBalance = 0;
    
        for (const network of coin.networks) {
            const balance = await getBalanceFromChain(network.publicAddress, network.name);
            const usdPrice = await getPriceInUSD(coin.name);
            const networkWorth = balance * usdPrice;
    
            coinTotalWorth += networkWorth;
            totalCoinBalance += balance;
        }
    
        totalWorth[coin.name] = {
            coinTotalWorth,
            balance: totalCoinBalance,
        };
    
        totalPortfolioValue += coinTotalWorth
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
    Ethereum: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
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
    coinName: string
): Promise<number> => {
    try {
        console.log(publicAddress, coinName)
        if (coinName === "Solana") {
            const connection = await solanaConnection()
            const publicKey = new PublicKey(publicAddress);
            const balance = await connection.getBalance(publicKey);
            return balance / 1e9;
        }

        if (coinName === "Ethereum") {
            const rpcUrl = RPC_URLS[coinName];
            if (!rpcUrl) {
                throw new Error(`RPC URL not found for network: ${coinName}`);
            }

            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const balance = await provider.getBalance(publicAddress);
            return parseFloat(ethers.formatEther(balance));
        }

        if (coinName === "Binance Smart Chain (BSC)") {
            const provider = new JsonRpcProvider(process.env.BSC_RPC_URL);
            const balanceWei = await provider.getBalance(publicAddress);
            return Number(formatEther(balanceWei))
        }

        if (coinName === "USDT") {
            const contractAddress = USDT_CONTRACT_ADDRESSES.Ethereum
            const rpcUrl = RPC_URLS.Binance

            const provider = new ethers.JsonRpcProvider(rpcUrl);

            const usdtAbi = ["function balanceOf(address account) view returns (uint256)"];
            const usdtContract = new ethers.Contract(contractAddress, usdtAbi, provider);
            console.log(usdtContract)

            const balance = await usdtContract.balanceOf(publicAddress);
            console.log(balance)
            return parseFloat(ethers.formatUnits(balance, 6))
        }

        throw new Error(`Unsupported network: ${coinName}`);
    } catch (error) {
        console.error(`Error fetching balance for ${coinName}:`, error);
        return 0;
    }
};
