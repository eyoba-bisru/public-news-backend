const typeDefs = `
type User {
  id: ID!
  name: String!
  email: String!
  uid: String!
  role: Role!
  shortName: String
  logo: String
  phone: Int
  createdAt: String
  updatedAt: String
}

enum Role {
  ADMIN
  EDITOR
  USER
}

type Query {
  users: [User]
}

`;

// type Mutation {
//     signUp(name: String!, email: String!, role: Role): User
// }
module.exports = { typeDefs };
