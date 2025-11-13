import { FastifyPluginCallback } from 'fastify'

export interface Route {
  path: string
  router: FastifyPluginCallback
}

export type Routes = Array<Route>
