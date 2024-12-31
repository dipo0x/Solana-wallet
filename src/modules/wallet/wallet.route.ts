import { FastifyInstance } from 'fastify';
import walletController from './wallet.controller';
import { validateUser } from '../../middlewares/auth.middleware';
import { sendCryptoInputSchema } from './wallet.schema'

async function walletRoutes(server: FastifyInstance) {
  server.post('/send-sol', 
    {
      schema: sendCryptoInputSchema,
      preHandler: validateUser,
    },
    walletController.sendOut
  )
  server.get('/retrieve-balance-with-transactions', {
    handler: walletController.getBalanceWithTransactions
  })
}

export default walletRoutes;