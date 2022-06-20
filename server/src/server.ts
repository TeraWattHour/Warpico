import { ApolloServer } from "apollo-server-express";
import AuthResolver from "./modules/auth/authResolver";
import combineApolloProperties from "./utils/combineApolloProperties";
import AuthTypedefs from "./modules/auth/authTypedefs";
import UserTypedefs from "./modules/user/userTypedefs";
import type { Application } from "express";
import { prisma } from "./prisma";
import { Context } from "./types";
import { redisClient } from "./redis";
import UserResolver from "./modules/user/userResolver";

export const setupApollo = async (app: Application) => {
  const server = new ApolloServer({
    ...combineApolloProperties({
      typeDefs: [AuthTypedefs, UserTypedefs],
      resolvers: [AuthResolver, UserResolver],
    }),
    context: async ({ req, res }) => {
      let user = null;
      if (req.session?.isAuthenticatied) {
        const dbUser = await prisma.user.findUnique({
          where: { id: req.session?.userId },
        });
        if (dbUser) {
          if (dbUser.tokenVersion !== req.session?.tokenVersion) {
            req.session.destroy(() => null);
          } else {
            user = dbUser;
          }
        }
      }

      return { req, res, db: prisma, redis: redisClient, user } as Context;
    },
    debug: false,
  });

  await server.start();

  server.applyMiddleware({ app });

  return server;
};
