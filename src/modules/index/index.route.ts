import { FastifyInstance } from 'fastify';
import indexController from './index.controller';

async function indexRoutes(server: FastifyInstance) {
  server.get('/', {
    handler: indexController.index
  })
}

export default indexRoutes;