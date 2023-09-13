import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import TResponse from '../types/response.type';

export class PromptController {
  /**
   * Get all prompts
   */
  async index(request: FastifyRequest, reply: FastifyReply): Promise<TResponse> {
    const prompts = await prisma.prompt.findMany()
    return reply.send({ data: prompts, meta: {} })
  }
}
