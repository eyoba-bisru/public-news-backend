const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { resolvers } = require("./resolvers/resolvers");
const { typeDefs } = require("./typeDefs/typeDefs");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  // context: {},
})
  .then(async (data) => {
    console.log(`🚀  Server ready at: ${data.url}`);
  })
  .catch((err) => console.log("hello"));