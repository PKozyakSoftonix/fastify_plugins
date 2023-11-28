import fp from "fastify-plugin";
import { FastifyPluginCallback, FastifyInstance, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

interface MyCorsOptions {
  allowedOrigins?: string[];
}

const myCorsPlugin: FastifyPluginCallback<MyCorsOptions> = (fastify: FastifyInstance, options: MyCorsOptions, done: HookHandlerDoneFunction) => {
  const { allowedOrigins = ['http://localhost'] } = options;

  const corsHandler = (req: FastifyRequest, reply: any) => {
    const requestOrigin = req.headers.origin as string;

    if (allowedOrigins.includes(requestOrigin)) {
      reply.header('Access-Control-Allow-Origin', requestOrigin);
      reply.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      reply.header('Access-Control-Allow-Credentials', 'true');
    } else {
      console.log('Не задовільняє умову');
    }
  };

  fastify.addHook('onRequest', (req: FastifyRequest, reply: any, next: HookHandlerDoneFunction) => {
    corsHandler(req, reply);
    next();
  });

  fastify.options('*', (req: FastifyRequest, reply: any) => {
    corsHandler(req, reply);
    reply.code(204).send();
  });

  done();
};

export default fp(myCorsPlugin, '4.x');
