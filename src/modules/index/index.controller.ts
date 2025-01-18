import { FastifyReply, FastifyRequest } from 'fastify';

const index = {
    async index(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
      try {
            return reply.code(200).send({
                status: 200,
                success: true,
                message: "Springten API is up and running",
        });
    }
    catch (e) {
        console.log(e)
        return reply.code(500).send({
            status: 500,
            success: false,
            message: e,
        });
      }
    }
}

export default index