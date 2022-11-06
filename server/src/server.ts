import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { pollRoutes } from "./routes/poll";
import { betRoutes } from "./routes/bet";
import { gameRoutes } from "./routes/game";
import { userRoutes } from "./routes/user";
import { authRoutes } from "./routes/auth";

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt, {
    secret: "nlwcopa-server",
  });

  fastify.register(pollRoutes);
  fastify.register(betRoutes);
  fastify.register(gameRoutes);
  fastify.register(userRoutes);
  fastify.register(authRoutes);

  await fastify.listen({ port: 3333, host: "0.0.0.0" });
}

bootstrap();
