
import { Wallet } from 'ethers';
import { createCoinAndNetwork } from '../utils/coin.utils';
import { Types } from 'mongoose';

const { NETWORK_ENVIRONMENT } = process.env

export const generateOnboardingAddresses = async ( walletId: Types.ObjectId ) => {
    try{
        const wallet = Wallet.createRandom();

        const privateKey = wallet.privateKey;
        const publicAddress = wallet.address;
    
        await createCoinAndNetwork("Ethereum", "ETH", walletId, `Ethereum ${NETWORK_ENVIRONMENT}`, privateKey, publicAddress)
    }
    catch(e){
        console.log(e)
    }
}