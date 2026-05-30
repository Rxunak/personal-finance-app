import fastify from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import authRoutes from "./routes/auth.routes.js";
import budgetRoutes from "./routes/budgets.routes.js";
import overviewRoutes from "./routes/overview.routes.js";
import potRoutes from "./routes/pots.routes.js";
import transactionRoutes from "./routes/transactions.routes.js";
import type {ZodTypeProvider} from "fastify-type-provider-zod";
import {serializerCompiler, validatorCompiler} from "fastify-type-provider-zod"

const app = fastify({
    logger:true
}).withTypeProvider<ZodTypeProvider>();

app.register(cors, {
    methods: ["GET", "HEAD", "POST", "PATCH", "DELETE", "OPTIONS"],
});
app.register(formbody);
app.register(helmet);
app.register(multipart);

app.register(authRoutes);
app.register(budgetRoutes);
app.register(overviewRoutes);
app.register(potRoutes);
app.register(transactionRoutes);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);


app.get("/", async (request, reply) => {
    return {hello: "world"}
})



export default app;
