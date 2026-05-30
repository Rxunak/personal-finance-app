import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import {
  deleteTransaction,
  listTransactions,
  TransactionNotFoundError,
  updateTransaction,
} from "../services/transaction.service.js";

const transactionParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const updateTransactionBodySchema = z.object({
  name: z.string().trim().min(1),
  category: z.string().trim().min(1),
  amount: z.number().finite(),
  date: z.iso.datetime(),
});

type TransactionRouteParams = z.infer<typeof transactionParamsSchema>;
type UpdateTransactionBody = z.infer<typeof updateTransactionBodySchema>;

const transactionRoutes = async (app: FastifyInstance, _opts: FastifyPluginOptions) => {
  app.get("/transactions", async (_request, reply) => {
    const transactions = await listTransactions();
    return reply.send(transactions);
  });

  app.patch(
    "/transactions/:id",
    {
      schema: {
        params: transactionParamsSchema,
        body: updateTransactionBodySchema,
      },
    },
    async (request, reply) => {
      try {
        const params = transactionParamsSchema.parse(request.params);
        const body = updateTransactionBodySchema.parse(request.body);
        const transaction = await updateTransaction(
          params.id,
          body,
        );
        return reply.send(transaction);
      } catch (error) {
        if (error instanceof TransactionNotFoundError) {
          return reply.status(404).send({
            message: error.message,
          });
        }

        throw error;
      }
    },
  );

  app.delete(
    "/transactions/:id",
    {
      schema: {
        params: transactionParamsSchema,
      },
    },
    async (request, reply) => {
      try {
        const params = transactionParamsSchema.parse(request.params);
        const response = await deleteTransaction(params.id);
        return reply.send(response);
      } catch (error) {
        if (error instanceof TransactionNotFoundError) {
          return reply.status(404).send({
            message: error.message,
          });
        }

        throw error;
      }
    },
  );
};

export default transactionRoutes;
