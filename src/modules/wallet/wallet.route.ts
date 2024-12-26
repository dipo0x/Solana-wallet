import { FastifyInstance } from 'fastify';
import walletController from './wallet.controller';

async function walletRoutes(server: FastifyInstance) {
  server.post('/send-sol', {
    handler: walletController.sendOut
  })
//   server.post('/get-balance-with-transactions', {
//     handler: walletController.sendOut
//   })
  server.get('/retrieve-balance-with-transactions', {
    handler: walletController.getBalanceWithTransactions
  })
}

export default walletRoutes;