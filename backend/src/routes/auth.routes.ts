import type { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import app from "../app.js";
import { registerSchema } from "../validations/auth-validation.js";
const authRoutes = async (app:FastifyInstance, opts:FastifyPluginOptions) => {

    app.post("/register",{schema: {
        body: registerSchema
    }}, async(req:FastifyRequest, reply:FastifyReply) => {
        return reply.send("Nearly there")
    })

}

export default authRoutes;
