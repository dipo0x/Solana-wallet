import { FastifyInstance } from 'fastify';
import accountController from './account.controller';
import authenticate from '../../middlewares/auth.middleware';

async function accountRoutes(server: FastifyInstance) {
  server.get('/settings',
    {
      preHandler: authenticate,
    },
    accountController.accountSettings
  ),
  server.get('/assets',
    {
      preHandler: authenticate,
    },
    accountController.getAssetsDetails
  )
}

export default accountRoutes;