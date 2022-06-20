const UserTypedefs = `
  type Query {
    me: User
    getMyFollowedUsers: [User]
  }

  type Mutation {
    follow(userId: String!): User
  }

  type User {
    id: ID
    email: String
    name: String
    code: String
    profile: Profile
  }

  type Profile {
    id: ID        
    avatarUrl: String
    bio: String  
    pronouns: String
    userId: String
    user: User
  }
`;

export default UserTypedefs;
