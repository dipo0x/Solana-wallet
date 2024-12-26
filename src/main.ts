import fastify from 'fastify';
import userRoutes from './modules/user/user.route';
import walletRoutes from './modules/wallet/wallet.route';
import dotenv from 'dotenv';
import connectDB from './config/database';
dotenv.config();

export const port = Number(process.env.PORT) || 3000;

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
        message: 'Page does not exist',
      });
    });

  server.register(userRoutes, { prefix: 'api/user/' })
  server.register(walletRoutes, { prefix: 'api/wallet/' })

  try {
    await server.listen({ port: port });
    await connectDB()
    console.log('Server ready on port', port);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

main();