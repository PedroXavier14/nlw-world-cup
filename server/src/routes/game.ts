import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/polls/:id/games",
    {
      onRequest: [authenticate],
    },
    async (request) => {
      const getGameParams = z.object({
        id: z.string(),
      });

      const { id } = getGameParams.parse(request.params);

      const games = await prisma.game.findMany({
        orderBy: {
          date: "desc",
        },
        include: {
          bets: {
            where: {
              participant: {
                userId: request.user.sub,
                poolId: id,
              },
            },
          },
        },
      });

      return {
        games: games.map((game) => {
          return {
            ...game,
            bet: game.bets.length > 0 ? game.bets[0] : null,
            bets: undefined,
          };
        }),
      };
    }
  );
}
