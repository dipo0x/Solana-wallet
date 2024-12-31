import { FastifyInstance } from 'fastify';
import userController from './user.controller';

async function userRoutes(server: FastifyInstance) {
  server.post('create-new-wallet', {
    handler: userController.createWallet
  })
  server.post('sign-in', {
    handler: userController.loginWallet
  })
}

export default userRoutes;