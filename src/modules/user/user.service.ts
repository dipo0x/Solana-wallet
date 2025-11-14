import { Keypair } from "@solana/web3.js";
import mongoose from "mongoose";
import { User } from "./models/user.model";
import { Security } from "./models/user.security.model";
import Wallet from "../wallet/models/wallet.model";
import { Coin, Network } from "../wallet/models/wallet.coin.model";
import { generateOnboardingAddresses } from "../../helpers/onboardingWallets.helpers";
import { generateRecoveryPhrase, hashRecoveryPhrase, hashWords } from "../../utils/generate.utils";
import { validateRecoveryPhrase } from "../../utils/validate";

export default class UserService {
  static async createWallet(wallet_name: string) {
    // Create user
    const user = await User.create({ username: wallet_name });

    // Generate keypair
    const keypair = Keypair.generate();
    const publicAddress = keypair.publicKey.toString();
    const privateAddress = Buffer.from(keypair.secretKey).toString("base64");

    // Generate unique recovery phrase
    let recoveryPhrase = "";
    let recoveryPhraseHash = "";
    let recoveryWordHashes;
    let isDuplicate = true;

    while (isDuplicate) {
      recoveryPhrase = generateRecoveryPhrase();
      recoveryPhraseHash = await hashRecoveryPhrase(recoveryPhrase);
      recoveryWordHashes = hashWords(recoveryPhrase);
      isDuplicate = await this.isDuplicateRecoveryPhrase(recoveryWordHashes);
    }

    // Save user security info
    const userSecurity = await Security.create({
      userId: user._id,
      private_key: privateAddress,
      recoveryPhraseHash,
      recoveryWordHashes,
    });

    user.securityId = new mongoose.Types.ObjectId(userSecurity._id);

    // Create network and coin
    const network = await Network.create({
      name: "Solana",
      privateAddress,
      publicAddress,
      coinId: null,
    });

    const coin = await Coin.create({
      name: "Solana",
      symbol: "SOL",
      walletId: null,
      networks: [network._id],
    });

    network.coinId = coin._id as mongoose.Types.ObjectId;
    await network.save();

    // Create wallet
    const userWallet = await Wallet.create({
      user: user._id,
      coins: [coin._id],
    });
    coin.walletId = userWallet._id as mongoose.Types.ObjectId;
    await coin.save();

    user.walletId = new mongoose.Types.ObjectId(userWallet._id);
    await user.save();

    await generateOnboardingAddresses(userWallet._id as mongoose.Types.ObjectId);

    return { user, recoveryPhrase };
  }

  static async isDuplicateRecoveryPhrase(hashIdentifier: Record<number, string>): Promise<boolean> {
    const existing = await Security.findOne({ recoveryWordHashes: hashIdentifier });
    return !!existing;
  }

  static async loginWallet(key_phrases: string) {
    const user = await validateRecoveryPhrase(key_phrases);
    return user;
  }
}
