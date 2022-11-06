import { FastifyInstance } from "fastify";
import { number, z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function betRoutes(fastify: FastifyInstance) {
  fastify.get("/bets/count", async () => {
    const count = await prisma.bet.count();
    return { count };
  });

  fastify.post(
    "/polls/:pollId/games/:gameId/bets",
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const createBetParams = z.object({
        pollId: z.string(),
        gameId: z.string(),
      });

      const createBetBody = z.object({
        homeTeamPoints: z.number(),
        awayTeamPoints: z.number(),
      });

      const { pollId, gameId } = createBetParams.parse(request.params);
      const { homeTeamPoints, awayTeamPoints } = createBetBody.parse(
        request.body
      );

      const participant = await prisma.participant.findUnique({
        where: {
          userId_poolId: {
            poolId,
            userId: request.user.sub,
          },
        },
      });

      if (!participant) {
        return reply.status(400).send({
          message: "You're not allowerd to create a bet inside this poll.",
        });
      }

      const bet = await prisma.bet.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });

      if (bet) {
        return reply.status(400).send({
          message: "You alreadt sent a bet to this game on this poll.",
        });
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        return reply.status(400).send({
          message: "Game not found.",
        });
      }

      if (game.date < new Date()) {
        return reply.status(400).send({
          message: "You cannot send bets after the game.",
        });
      }

      await prisma.bet.create({
        data: {
          gameId,
          participantId: participant.id,
          homeTeamPoints,
          awayTeamPoints,
        },
      });

      return reply.status(201).send();
    }
  );
}
