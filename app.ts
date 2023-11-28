import fastify, { FastifyLoggerOptions } from 'fastify';
import fastifyCookie from "@fastify/cookie";
import cookie from "./plugins/cookie";
import myCorsPlugin from "./plugins/cors";
import { FastifyRequest, FastifyReply } from 'fastify';

function getLoggerOptions(): FastifyLoggerOptions {
  const localPrintOpts = {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss.l Z',
        ignore: 'pid,hostname'
      }
    }
  };

  const opts: FastifyLoggerOptions & {redact: string[]} = {
    level: 'trace',
    redact: ['req.headers.authorization'],
    serializers: {
      req (request) {
        return {
          ip: request.ip,
          method: request.method,
          url: request.url,
          path: request.routeOptions.url,
          query: request.query,
          parameters: request.params,
          headers: request.headers
        };
      }
    }
  };

  return { ...localPrintOpts, ...opts };

}

async function run() {
  const server = fastify({
    logger: getLoggerOptions(),
    trustProxy: true
  });

  // load plugins
  server.register(fastifyCookie);
  server.register(cookie);
  server.register(myCorsPlugin, {
    allowedOrigins: ['http://localhost'],
  });


  server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ message: 'Hello, World!' });
  });


  try {
    await server.ready();
    await server.listen({
      port: 3000
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();