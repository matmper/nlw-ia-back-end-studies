import { prisma } from '../lib/prisma';

export class PromptController {
  /**
   * Get all prompts
   */
  async index() {
    return await prisma.prompt.findMany();
  }
}
