import { ApolloError } from "apollo-server-core";
import { SOMETHING_WENT_WRONG } from "common/lang/errors";
import { SafeParseError } from "zod";

export class ZodError extends ApolloError {
  constructor(error: SafeParseError<any>) {
    super(SOMETHING_WENT_WRONG, "BAD_USER_INPUT", {
      details: error.error.issues.map((x) => ({
        message: x.message,
        field: x.path[0],
      })),
    });
  }
}
