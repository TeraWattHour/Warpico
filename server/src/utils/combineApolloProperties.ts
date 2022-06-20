import { gql } from "apollo-server-core";

const combineApolloProperties = ({
  typeDefs,
  resolvers,
}: ICombineApolloProperties) => {
  const typeDefString = typeDefs.join("\n");

  return {
    typeDefs: gql(typeDefString),
    resolvers,
  };
};

type ICombineApolloProperties = {
  typeDefs: string[];
  resolvers: any[];
};

export default combineApolloProperties;
