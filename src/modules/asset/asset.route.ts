import { FastifyInstance } from 'fastify';
import assetController from './asset.controller';
import authenticate from '../../middlewares/auth.middleware';

async function assetRoutes(server: FastifyInstance) {
  server.get('/assets',
    {
      preHandler: authenticate,
    },
    assetController.getAssets
  ),
  server.get('/details/:id',
    {
      preHandler: authenticate,
    },
    assetController.getAssetsDetails
  )
}

export default assetRoutes;