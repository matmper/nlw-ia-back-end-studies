import { FastifyInstance } from 'fastify';
import { PromptController } from '../controllers/promptController';
import { PageController } from '../controllers/pageController';
import { fastifySwagger } from '@fastify/swagger';

export async function getApiRoutes(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'NFW IA 2023 - API',
        version: '1.0.0',
      },
      host: process.env.APP_HOST || '0.0.0.0',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        apiKey: { type: 'apiKey', name: 'apiKey', in: 'header' },
      },
    },
  });

  app.get('/', async () => {
    const pageController = new PageController();
    return await pageController.index();
  });

  app.get('/prompts', async () => {
    const promptController = new PromptController();
    return await promptController.index();
  });
}
