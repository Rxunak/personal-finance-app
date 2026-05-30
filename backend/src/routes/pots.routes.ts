import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import {
  createPot,
  deletePot,
  listPots,
  PotNotFoundError,
  updatePot,
  updatePotBalance,
} from "../services/pot.service.js";

const potParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const potBodySchema = z.object({
  name: z.string().trim().min(1),
  target: z.number().finite().nonnegative(),
  total: z.number().finite().nonnegative().optional(),
  theme: z.string().trim().min(1),
});

const potBalanceBodySchema = z.object({
  amountDelta: z.number().finite(),
});

const potRoutes = async (app: FastifyInstance, _opts: FastifyPluginOptions) => {
  app.get("/pots", async (_request, reply) => {
    const pots = await listPots();
    return reply.send(pots);
  });

  app.post(
    "/pots",
    {
      schema: {
        body: potBodySchema,
      },
    },
    async (request, reply) => {
      const body = potBodySchema.parse(request.body);
      const pot = await createPot(body);
      return reply.status(201).send(pot);
    },
  );

  app.patch(
    "/pots/:id",
    {
      schema: {
        params: potParamsSchema,
        body: potBodySchema,
      },
    },
    async (request, reply) => {
      try {
        const params = potParamsSchema.parse(request.params);
        const body = potBodySchema.parse(request.body);
        const pot = await updatePot(params.id, body);
        return reply.send(pot);
      } catch (error) {
        if (error instanceof PotNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }

        throw error;
      }
    },
  );

  app.patch(
    "/pots/:id/balance",
    {
      schema: {
        params: potParamsSchema,
        body: potBalanceBodySchema,
      },
    },
    async (request, reply) => {
      try {
        const params = potParamsSchema.parse(request.params);
        const body = potBalanceBodySchema.parse(request.body);
        const pot = await updatePotBalance(params.id, body.amountDelta);
        return reply.send(pot);
      } catch (error) {
        if (error instanceof PotNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }

        throw error;
      }
    },
  );

  app.delete(
    "/pots/:id",
    {
      schema: {
        params: potParamsSchema,
      },
    },
    async (request, reply) => {
      try {
        const params = potParamsSchema.parse(request.params);
        const response = await deletePot(params.id);
        return reply.send(response);
      } catch (error) {
        if (error instanceof PotNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }

        throw error;
      }
    },
  );
};

export default potRoutes;
