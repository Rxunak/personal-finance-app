import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getOverviewData } from "../services/overview.service.js";

const overviewRoutes = async (
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
) => {
  app.get("/overview", async (_request, reply) => {
    const overviewData = await getOverviewData();
    return reply.send(overviewData);
  });
};

export default overviewRoutes;
