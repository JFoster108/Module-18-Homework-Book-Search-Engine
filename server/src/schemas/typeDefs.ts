import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Book {
    _id: ID!
    title: String!
    authors: [String]!
    description: String
    image: String
    link: String
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Auth {
    token: String!
    user: User
  }

  type Query {
    me: User
  }

  input BookInput {
    title: String!
    authors: [String]!
    description: String
    image: String
    link: String
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: BookInput!): User
    removeBook(bookId: ID!): User
  }
`;
