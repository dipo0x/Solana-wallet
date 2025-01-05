import 'fastify';
import IUser from './user/user.type';

declare module 'fastify' {
  interface FastifyRequest {
    user?: IUser
  }
}
