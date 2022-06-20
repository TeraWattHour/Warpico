import { AuthenticationError } from "apollo-server-core";
import { FORBIDDEN } from "common/lang/auth";
import { Context } from "../../types";

const UserResolver = {
  Query: {
    me: async (_: void, __: void, ctx: Context) => {
      if (!ctx.req.session.isAuthenticatied)
        throw new AuthenticationError(FORBIDDEN);

      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.req.session.userId,
        },
        include: {
          profile: true,
        },
      });
      if (!user) throw new AuthenticationError(FORBIDDEN);

      return user;
    },
  },
};

export default UserResolver;
