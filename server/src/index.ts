import express from "express";
import http from "http";
import session from "express-session";
import connectRedis from "connect-redis";
import { setupApollo } from "./server";
import { setupRedis, redisClient } from "./redis";
require("dotenv").config();

declare module "express-session" {
  interface SessionData {
    userId: string;
    isAuthenticatied: boolean;
    tokenVersion: number;
  }
}

const PORT = process.env.PORT;

(async () => {
  await setupRedis();

  const app = express();

  const RedisStore = connectRedis(session);

  app.use(
    session({
      name: "qid",
      secret: process.env.COOKIE_SECRET!,
      store: new RedisStore({ client: redisClient }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 1000 * 3600 * 24 * 7 * 365,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      },
    })
  );

  const httpServer = http.createServer(app);
  const server = await setupApollo(app);

  await new Promise<void>((t) => httpServer.listen({ port: PORT }, t));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
})();
