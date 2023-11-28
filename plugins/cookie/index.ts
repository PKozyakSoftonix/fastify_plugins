import { v4 as uuidv4 } from "uuid";
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const sessionKeyName = 'sessionKeyName'

const setCookie = (reply:any , name:any, value:any, options:any) => {
  let cookieValue = `${name}=${value}`;

  if (options) {
    if (options.httpOnly) {
      cookieValue += '; HttpOnly';
    }
  }

  reply.raw.setHeader('Set-Cookie', cookieValue);
};

const plugin: FastifyPluginAsync = async function (fastify) {
  fastify.addHook('onRequest', async (request, reply) => {
    const existingCookie = request.cookies[sessionKeyName];

    if (!existingCookie) {
      const newUUID = uuidv4();

      setCookie(reply, sessionKeyName, newUUID, {
        httpOnly: true,
      });
    }
  });
};

export default fp(plugin, '4.x');

