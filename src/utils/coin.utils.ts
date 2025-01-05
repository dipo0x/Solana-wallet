import { Coin } from '../modules/wallet/models/wallet.coin.model';
import { Network } from '../modules/wallet/models/wallet.coin.model';
import mongoose, { Types } from 'mongoose';
import Wallet from '../modules/wallet/models/wallet.model';
import wallet from '../modules/wallet/wallet.controller';

export const createCoinAndNetwork = async (
    coinName: string,
    coinSymbol: string,
    walletId: Types.ObjectId,
    networkName: string,
    privateAddress: string,
    publicAddress: string,
) => {
    try {
        if (!Types.ObjectId.isValid(walletId)) {
            throw new Error('Invalid walletId provided');
        }

        const network = await Network.create({
            name: networkName,
            privateAddress,
            publicAddress,
        });

        const coin = await Coin.create({
            name: coinName,
            symbol: coinSymbol,
            walletId,
            networks: [network._id]
        });

        network.coinId = coin._id as mongoose.Types.ObjectId;
        await network.save();
        
        const wallet = await Wallet.findById(walletId);
        wallet?.coins.push(coin._id)
        await wallet?.save();

        return { coin, network };
    } catch (error) {
        console.error('Error creating Coin and Network:', error);
        throw new Error('Failed to create Coin and Network');
    }
};

export const calculateWalletWorth = async (
    walletId: Types.ObjectId
) => 
    {
    const pricingApi = 'https://api.coingecko.com/api/v3/simple/price';
    const totalWorth: { [key: string]: number } = {};
    let totalPortfolioValue = 0;
    const wallet = await Wallet.findById(walletId)
    if(!wallet){
        throw new Error('Invalid walletId provided');
    }

    // Loop through each coin in the wallet
    for (const coin of wallet?.coins) {
        console.log(`Fetching data for coin: ${coin.name} (${coin.symbol})`);
        let coinTotalWorth = 0;

        // Loop through each network of the coin
        for (const network of coin.networks) {
            console.log(`Fetching balance for network: ${network.name} (${network.publicAddress})`);
            const balance = await getBalanceFromChain(network.publicAddress, network.name);

            // Get price in USD for the coin
            const usdPrice = await getPriceInUSD(coin.name);
            const networkWorth = balance * usdPrice;

            console.log(`Network: ${network.name}, Balance: ${balance}, Worth: $${networkWorth.toFixed(2)}`);

            coinTotalWorth += networkWorth;
        }

        totalWorth[coin.name] = coinTotalWorth;
        totalPortfolioValue += coinTotalWorth;
    }

    // Display total worth and individual worths
    console.log(`Total Portfolio Value: $${totalPortfolioValue.toFixed(2)}`);
    console.log('Individual Worth:', totalWorth);
    return { totalPortfolioValue, totalWorth };
}