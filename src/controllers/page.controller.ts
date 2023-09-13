import { FastifyReply, FastifyRequest } from "fastify";
import TResponse from "../types/response.type";

export class PageController {
  /**
   * Application Index
   */
  async index(request: FastifyRequest, reply: FastifyReply): Promise<TResponse> {
    return reply.send({ data: { success: true }, meta: {} })
  }
}
