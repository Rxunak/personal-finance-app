import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";

import {
  AiConfigurationError,
  generateAssistantAnswer,
} from "../services/ai.service.js";

const assistantMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1),
});

const assistantContextSchema = z.object({
  balance: z.object({
    current: z.number().finite(),
    income: z.number().finite(),
    expenses: z.number().finite(),
  }),
  health: z.object({
    score: z.number().finite(),
    delta: z.number().finite().nullable(),
    recommendations: z.array(z.string()),
  }),
  budgets: z.array(
    z.object({
      category: z.string(),
      maximum: z.number().finite(),
    }),
  ),
  pots: z.array(
    z.object({
      name: z.string(),
      target: z.number().finite(),
      total: z.number().finite(),
    }),
  ),
  topInsights: z.array(
    z.object({
      title: z.string(),
      summary: z.string(),
      detail: z.string(),
      group: z.string(),
      tone: z.string(),
    }),
  ),
  subscriptions: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
      monthlyCost: z.number().finite(),
      annualCost: z.number().finite(),
      status: z.enum(["active", "watch", "cancel"]),
      recommendation: z.string(),
    }),
  ),
  recentTransactions: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
      amount: z.number().finite(),
      date: z.string(),
      recurring: z.boolean(),
    }),
  ),
  monthlyCashflow: z.array(
    z.object({
      label: z.string(),
      income: z.number().finite(),
      expenses: z.number().finite(),
      net: z.number().finite(),
    }),
  ),
});

const assistantBodySchema = z.object({
  question: z.string().trim().min(1),
  messages: z.array(assistantMessageSchema).max(8),
  context: assistantContextSchema,
});

const aiRoutes = async (app: FastifyInstance, _opts: FastifyPluginOptions) => {
  app.post(
    "/ai/assistant",
    {
      schema: {
        body: assistantBodySchema,
      },
    },
    async (request, reply) => {
      try {
        const body = assistantBodySchema.parse(request.body);
        const response = await generateAssistantAnswer(
          body.question,
          body.messages,
          body.context,
        );

        return reply.send(response);
      } catch (error) {
        if (error instanceof AiConfigurationError) {
          return reply.status(503).send({
            message: error.message,
          });
        }

        request.log.error(error);
        return reply.status(500).send({
          message: "The AI assistant could not generate a response.",
        });
      }
    },
  );
};

export default aiRoutes;
