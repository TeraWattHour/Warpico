import { gql } from "apollo-server-core";

const AuthTypedefs = `
  type Mutation {
    login(email: String!, password: String!): User
    register(name: String!, email: String!, password: String!): User
    logout: Boolean
  }
`;

export default AuthTypedefs;
