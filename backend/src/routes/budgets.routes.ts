import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import {
  BudgetNotFoundError,
  createBudget,
  deleteBudget,
  listBudgets,
  updateBudget,
} from "../services/budget.service.js";

const budgetParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const budgetBodySchema = z.object({
  category: z.string().trim().min(1),
  maximum: z.number().finite().nonnegative(),
  theme: z.string().trim().min(1),
});

const budgetRoutes = async (
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
) => {
  app.get("/budgets", async (_request, reply) => {
    const budgets = await listBudgets();
    return reply.send(budgets);
  });

  app.post(
    "/budgets",
    {
      schema: {
        body: budgetBodySchema,
      },
    },
    async (request, reply) => {
      const body = budgetBodySchema.parse(request.body);
      const budget = await createBudget(body);
      return reply.status(201).send(budget);
    },
  );

  app.patch(
    "/budgets/:id",
    {
      schema: {
        params: budgetParamsSchema,
        body: budgetBodySchema,
      },
    },
    async (request, reply) => {
      try {
        const params = budgetParamsSchema.parse(request.params);
        const body = budgetBodySchema.parse(request.body);
        const budget = await updateBudget(params.id, body);
        return reply.send(budget);
      } catch (error) {
        if (error instanceof BudgetNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }

        throw error;
      }
    },
  );

  app.delete(
    "/budgets/:id",
    {
      schema: {
        params: budgetParamsSchema,
      },
    },
    async (request, reply) => {
      try {
        const params = budgetParamsSchema.parse(request.params);
        const response = await deleteBudget(params.id);
        return reply.send(response);
      } catch (error) {
        if (error instanceof BudgetNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }

        throw error;
      }
    },
  );
};

export default budgetRoutes;
