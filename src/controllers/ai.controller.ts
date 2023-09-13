import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import TResponse from "../types/response.type";
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";
import { Prisma } from "@prisma/client";

export class AiController {
  /**
   * Transcription a audio file to text using AI
   * @param request
   * @param reply
   * @returns Promise<TResponse>
   */
  async generate(request: FastifyRequest, reply: FastifyReply): Promise<TResponse> {
    const paramsSearch = z.object({ videoId: z.string().uuid() })
    const bodySearch = z.object({
      prompt: z.string(),
      temperature: z.number().min(0).max(1).default(0.5),
    })

    const { videoId } = paramsSearch.parse(request.params)
    const { prompt, temperature  } = bodySearch.parse(request.body)

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId
      }
    })

    if (!video.transcription) {
      return reply.status(404).send({ error: 'video transcription is empty'})
    }

    const promptMessage = prompt.replace('{transcription}', video.transcription)

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: promptMessage }
        ],
        temperature,
      })

      const promptVideo = await prisma.promptVideo.create({
        data: {
          videoId,
          externalId: response.id,
          model: response.model,
          response: response.choices as Prisma.JsonObject,
          prompt: prompt,
        }
      })

      return reply.send({ data: promptVideo, meta: { video }})
    } catch (error) {
      return reply.status(403).send({ error: error })
    }
  }
}
