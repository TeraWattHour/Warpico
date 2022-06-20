import {
  loginDto,
  LoginType,
  registerDto,
  RegisterType,
} from "common/dtos/auth";
import { BAD_CREDENTIALS, EMAIL_TAKEN } from "common/lang/auth";
import { Context } from "../../types";
import { ZodError } from "../../utils/errors";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateUserCode } from "../../utils/auth";
import { ApolloError, AuthenticationError } from "apollo-server-core";
import { INTERNAL_SERVER_ERROR } from "common/lang/errors";

const AuthResolver = {
  Mutation: {
    login: async (_: unknown, args: LoginType, ctx: Context) => {
      if (ctx.req.session.userId && ctx.req.session.isAuthenticatied)
        throw new AuthenticationError("You are already logged in.");

      const result = loginDto.safeParse(args);
      if (!result.success) throw new ZodError(result);

      const user = await ctx.db.user.findUnique({
        where: { email: result.data.email },
      });
      if (!user) {
        throw new AuthenticationError(BAD_CREDENTIALS);
      }

      const isValid = await bcrypt.compare(result.data.password, user.password);
      if (!isValid) throw new AuthenticationError(BAD_CREDENTIALS);

      ctx.req.session.userId = user.id;
      ctx.req.session.tokenVersion = user.tokenVersion;
      ctx.req.session.isAuthenticatied = true;
      ctx.req.session.save();

      return user;
    },
    register: async (_: unknown, args: RegisterType, ctx: Context) => {
      if (ctx.req.session.userId && ctx.req.session.isAuthenticatied)
        throw new AuthenticationError("You are already logged in.");

      const result = registerDto.safeParse(args);
      if (!result.success) {
        throw new ZodError(result);
      }

      const exists = await ctx.db.user.findUnique({
        where: { email: result.data.email },
      });
      if (exists) {
        throw new AuthenticationError(EMAIL_TAKEN);
      }

      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(result.data.password, salt);

      const codes = await ctx.db.user.findMany({
        where: { name: result.data.name },
        select: { code: true },
      });

      let code = generateUserCode();

      while (codes.map((x) => x.code).includes(code)) {
        code = generateUserCode();
      }

      const user = await ctx.db.user.create({
        data: {
          name: result.data.name,
          email: result.data.email,
          password: hash,
          code,
        },
      });
      return user;
    },
    logout: (_: void, __: void, ctx: Context) => {
      let result = false;
      ctx.req.session.destroy((err) => {
        result = !!!err;
      });
      return result;
    },
  },
};

export default AuthResolver;
