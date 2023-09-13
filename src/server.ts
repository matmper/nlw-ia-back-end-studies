import { fastify } from 'fastify';
import { getApiRoutes } from './routes/api';

const { APP_HOST = '0.0.0.0', APP_PORT = '3333' } = process.env;

const app = fastify();

app.register(getApiRoutes);

app
  .listen({
    host: APP_HOST,
    port: parseInt(APP_PORT),
  })
  .then(() => {
    console.log('HTTP Server Running');
  });
