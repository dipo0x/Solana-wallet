import { FastifyReply, FastifyRequest } from "fastify";
import { User } from "../modules/user/models/user.model";
import { Wallet } from "ethers";

export const validateUser = async (
    request: FastifyRequest<any>,
    reply: any,
) => {
    try {
        const publicKey = request.headers["public_key"]?.toString();
        // const user = await Wallet.
    } catch (e) {
        console.log(e);
        return reply.code(500).send({
            status: 500,
            success: false,
            message: e,
        });
    }
}

function next() {
    throw new Error("Function not implemented.");
}
