"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.port = void 0;
const fastify_1 = __importDefault(require("fastify"));
const wallet_route_1 = __importDefault(require("./modules/wallet/wallet.route"));
const uuidv4 = require('uuid').v4;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.port = Number(process.env.PORT) || 3000;
exports.server = (0, fastify_1.default)({
    logger: true,
    genReqId(req) {
        return uuidv4();
    },
});
exports.server.get('/healthcheck', function () {
    return __awaiter(this, void 0, void 0, function* () {
        return { status: 'Ok' };
    });
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.server.setErrorHandler((err, request, reply) => __awaiter(this, void 0, void 0, function* () {
            return reply.code(500).send({
                status: 500,
                success: false,
                message: 'Something went wrong',
            });
        })),
            exports.server.setNotFoundHandler((request, reply) => __awaiter(this, void 0, void 0, function* () {
                return reply.code(404).send({
                    status: 404,
                    success: false,
                    message: 'Page does not exist',
                });
            }));
        exports.server.register(wallet_route_1.default, { prefix: 'api/wallet/' });
        try {
            yield exports.server.listen({ port: exports.port });
            console.log('Server ready on port', exports.port);
        }
        catch (e) {
            console.log(e);
            process.exit(1);
        }
    });
}
main();
