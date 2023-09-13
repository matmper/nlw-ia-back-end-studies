import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PromptController } from '../controllers/prompt.controller';
import { PageController } from '../controllers/page.controller';
import { VideoController } from '../controllers/video.controller';
import TResponse from '../types/response.type';
import { AiController } from '../controllers/ai.controller';

export async function getApiRoutes(app: FastifyInstance) {
  app.get('/', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<TResponse> => {
    const pageController = new PageController();
    return await pageController.index(request, reply);
  });

  app.get('/prompts', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<TResponse> => {
    const promptController = new PromptController
    return await promptController.index(request, reply);
  });

  app.post('/videos', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<TResponse> => {
    const videoController = new VideoController
    return await videoController.store(request, reply);
  });

  app.post('/videos/:videoId/transcription', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<TResponse> => {
    const videoController = new VideoController
    return await videoController.transcription(request, reply);
  });

  app.post('/ai/:videoId/generate', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<TResponse> => {
    const aiController = new AiController
    return await aiController.generate(request, reply);
  });
}
