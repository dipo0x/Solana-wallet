import { PublicKey } from '@solana/web3.js';
import axios from "axios";
import { ethers, formatEther, JsonRpcProvider } from 'ethers';
import { Types } from 'mongoose';
import { solanaConnection } from '../../config/solana.config';
import { Coin, Network } from '../../modules/wallet/models/wallet.coin.model';
import { INetwork } from '../../types/network/network.type';

export const calculateWalletWorth = async (
    walletId: Types.ObjectId
) => 
    {
    const totalWorth: { [key: string]: { coinTotalWorth: number, balance: number, id: Types.ObjectId } } = {};
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
            id: coin._id
        };
    
        totalPortfolioValue += coinTotalWorth
    }
    return { totalPortfolioValue, totalWorth };
}

export const getPriceInUSD = async (symbol: string): Promise<number> => {
    const pricingApi = process.env.COINGECKO_URL!
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

export const getBalanceFromChain = async (
    publicAddress: string,
    coinName: string
): Promise<number> => {
    try {
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

        throw new Error(`Unsupported network: ${coinName}`);
    } catch (error) {
        console.error(`Error fetching balance for ${coinName}:`, error);
        return 0;
    }
};
