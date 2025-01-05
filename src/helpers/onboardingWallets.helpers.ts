
import { Wallet } from 'ethers';
import { createCoinAndNetwork } from '../utils/coin.utils';
import { Types } from 'mongoose';

const { NETWORK_ENVIRONMENT } = process.env

export const generateOnboardingAddresses = async ( walletId: Types.ObjectId ) => {
    try{
        await createCoinAndNetwork("Ethereum", "ETH", walletId, `Ethereum ${NETWORK_ENVIRONMENT}`, Wallet.createRandom().privateKey,  Wallet.createRandom().address)
        await createCoinAndNetwork("Binance Coin", "BNB", walletId, `Binance Smart Chain (BSC)`,  Wallet.createRandom().privateKey,  Wallet.createRandom().address)
        await createCoinAndNetwork("Tether", "USDT", walletId, `Binance Smart Chain (BSC)`,  Wallet.createRandom().privateKey,  Wallet.createRandom().address)
    }
    catch(e){
        console.log(e)
    }
}