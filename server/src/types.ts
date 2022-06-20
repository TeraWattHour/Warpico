import { PrismaClient, User } from "@prisma/client";
import { RedisClientType } from "@redis/client";
import type { Request, Response } from "express";

export type Context = {
  req: Request;
  res: Response;
  user?: User | null;
  db: PrismaClient;
  redis: RedisClientType;
};
