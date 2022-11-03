import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@gmail.com",
      avatarUrl: "https://github.com/PedroXavier14.png",
    },
  });

  const pool = await prisma.pool.create({
    data: {
      title: "Example pool",
      code: "POL123",
      onwerId: user.id,
      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-24T18:45:00.000Z",
      homeTeamCountryCode: "PT",
      awayTeamCountryCode: "NG",
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-28T16:00:00.000Z",
      homeTeamCountryCode: "PT",
      awayTeamCountryCode: "UY",

      bets: {
        create: {
          homeTeamPoints: 2,
          awayTeamPoints: 1,
          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
