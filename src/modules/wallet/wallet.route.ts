import { FastifyInstance } from 'fastify';
import walletController from './wallet.controller';
import authenticate from '../../middlewares/auth.middleware';
import { sendCryptoInputSchema } from './wallet.schema'

async function walletRoutes(server: FastifyInstance) {
  server.post('/send-sol',
    {
      schema: sendCryptoInputSchema,
      preHandler: authenticate,
    },
    walletController.sendOut
  )
  server.get('/retrieve-balance-with-transactions', {
    handler: walletController.getBalanceWithTransactions
  })
}

export default walletRoutes;