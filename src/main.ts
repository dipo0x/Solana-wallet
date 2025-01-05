import fastify from 'fastify';
import indexRoutes from './modules/index/index.route';
import accountRoutes from './modules/account/account.route';
import userRoutes from './modules/user/user.route';
import walletRoutes from './modules/wallet/wallet.route';
import dotenv from 'dotenv';
import connectDB from './config/database.config';
dotenv.config();

export const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || 'localhost';

const uuidv4 = require('uuid').v4;
export const server = fastify({
  logger: true,
  genReqId(req) {
    return uuidv4();
  },
});

server.get('/healthcheck', async function () {
  return { status: 'Ok' };
});

async function main() {
  server.setErrorHandler(async (err, request, reply) => {
    return reply.code(500).send({
      status: 500,
      success: false,
      message: 'Something went wrong',
    });
  }),
    server.setNotFoundHandler(async (request, reply) => {
      return reply.code(404).send({
        status: 404,
        success: false,
        message: `You shouldn't be here bro!`,
      });
    });

  server.register(indexRoutes, { prefix: '/' })
  server.register(userRoutes, { prefix: 'api/user/' })
  server.register(accountRoutes, { prefix: 'api/account/' })
  server.register(walletRoutes, { prefix: 'api/wallet/' })

  try {
    await server.listen({ host: host, port: port });
    await connectDB()
    console.log('Server ready on port', port);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

main();