import { fastify } from 'fastify';
import { getApiRoutes } from './routes/api';
import fastifyMultipart from '@fastify/multipart';
import "dotenv/config";

const {
  APP_HOST = '0.0.0.0',
  APP_PORT = '3333',
  STORAGE_MAXSIZE = '25'
} = process.env;

const app = fastify({
  logger: true
})

app.register(fastifyMultipart, {
  throwFileSizeLimit: true,
  limits: { fileSize: (1024 * 1024 * parseInt(STORAGE_MAXSIZE)), files: 1 }, // 25Mb
})

app.register(getApiRoutes);

app
  .listen({
    host: APP_HOST,
    port: parseInt(APP_PORT),
  })
  .then(() => {
    console.log('HTTP Server Running');
  });
