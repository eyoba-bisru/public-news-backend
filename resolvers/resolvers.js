const { prisma } = require("../prisma/client/prisma-client");

const resolvers = {
  Query: {
    users: async () => {
      const users = await prisma.user.findMany();
      return users;
    },
  },
  // Mutation: {
  //   signUp: async (_, args) => {
  //     const { role, name, email } = args;

  //     const user = await prisma.user.create({
  //       data: {
  //         email,
  //         name,
  //         role,
  //       },
  //     });
  //     return user;
  //   },
  // },
};

module.exports = { resolvers };
