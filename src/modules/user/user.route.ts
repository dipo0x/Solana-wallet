import { FastifyInstance } from 'fastify';
import userController from './user.controller';

async function userRoutes(server: FastifyInstance) {
  server.get('/create-new-wallet', {
    handler: userController.createWallet
  })
}

export default userRoutes;