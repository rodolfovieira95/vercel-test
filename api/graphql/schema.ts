import { gql } from "apollo-server-express";

const schema = gql`
  type User {
    id: ID!
    username: String
    email: String
    password: String
    token: String
  }

  input RegisterInput {
    username: String
    email: String
    password: String
  }

  input SignUpInput {
    email: String
    password: String
  }
  input SignInInput {
    email: String
    password: String
  }

  type Query {
    users: [User]
    user(id: ID): User
  }
  type Mutation {
    signin(signinInput: SignInInput): User
    signup(signupInput: SignUpInput): User
  }
`;

export default schema;
