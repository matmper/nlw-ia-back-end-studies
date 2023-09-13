import { FastifyReply, FastifyRequest } from "fastify";
import slugify from "slugify";
import { z } from "zod";
import TResponse from "../types/response.type";
import path from "node:path";
import fs, { createReadStream } from "node:fs";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";

const pump = promisify(pipeline)

export class VideoController {

  /**
   * Store a new video file
   * @param request
   * @param reply
   * @returns Promise<TResponse>
   */
  async store(request: FastifyRequest, reply: FastifyReply): Promise<TResponse> {
    const data = await request.file()

    if (!data) {
      return reply.status(400).send({ 'error': 'Missing upload file input'})
    }

    const ext = path.extname(data.filename)

    if (ext !== '.mp3') {
      return reply.status(400).send({ 'error': 'Only file type .mp3 is allowed'})
    }

    const fileBaseName = path.basename(data.filename, ext)
    const fileUploadName = `${slugify( fileBaseName, { lower: true} )}-${randomUUID()}${ext}`
    const uploadDestination = path.resolve(__dirname, '../../storage', fileUploadName);

    try {
      await pump(data.file, fs.createWriteStream(uploadDestination))

      const video = await prisma.video.create({
        data: {
          name: data.filename,
          path: uploadDestination
        }
      })

      return reply.send({ data: video, meta: {}})
    } catch (error) {
      return reply.status(500).send({ 'error': error})
    }
  }

  /**
   * Transcription a audio file to text using AI
   * @param request
   * @param reply
   * @returns Promise<TResponse>
   */
  async transcription(request: FastifyRequest, reply: FastifyReply): Promise<TResponse> {
    const paramsSearch = z.object({ videoId: z.string().uuid() })
    const bodySearch = z.object({ prompt: z.string() })

    const { videoId } = paramsSearch.parse(request.params)
    const { prompt } = bodySearch.parse(request.body)

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId
      }
    })

    if (video.transcription) {
      return reply.status(403).send({ error: 'video already has transcription'})
    }

    try {
      const audioReadStream = createReadStream(video.path)

      const response = await openai.audio.transcriptions.create({
        file: audioReadStream,
        model: 'whisper-1',
        language: 'pt',
        response_format: 'json',
        temperature: 0,
        prompt,
      })

      console.log(response.text)

      await prisma.video.update({
        where: { id: videoId },
        data: { transcription: response.text },
      })

      return reply.send({ data: {...video, transcription: response.text}, meta: {}})
    } catch (error) {
      return reply.status(403).send({ error: error })
    }
  }
}
