# Solana Wallet

### Introduction
This is simple solana wallet built with MongoDB, Google Cloud, Coingecko and Quicknode. You can send, receive Solana, create wallet, view multiple assets balance among other things.

### Setup

Clone the repository to your local machine.

```bash
git clone https://github.com/dipo0x/Solana-wallet
```
Ensure that you have Typescript and MongoDB installed on your machine. You could also use MongoDB Atlas.
Navigate to the directory where you cloned the project in a terminal.

```bash
cd solana-wallet
```

Run the following command to install the necessary dependencies

```bash
yarn install
```

Add a .env file following .env.example file example with the values of each variable

```.env
SOLANA_RPC_URL
PORT 
SOLANA_DEVNET_API
ENCRYPTION_KEY 
IV 
MONGODB_URI 
GOOGLE_CLOUD_KEY_RING 
GOOGLE_CLOUD_KEY
PROJECT_ID
GOOGLE_APPLICATION_CREDENTIALS
NETWORK_ENVIRONMENT 
ACCESS_TOKEN_EXPIRES_IN
ACCESS_TOKEN_PRIVATE_KEY
ETHEREUM_RPC_URL
BSC_RPC_URL
AVALANCHE_RPC_URL
COINGECKO_URL
```

</br>


### Running Server

#### Locally

Run the following command to start the server:

```bash
npm run dev
```

The server will run on http://localhost:3000 by default

</br>

This is still a work in progress and I am actively contributing to it.

### Conclusion

You can find additional documentation for this API, including request and response signatures, by visiting https://documenter.getpostman.com/view/17975360/2sAYJ7fyrB in your web browser.
