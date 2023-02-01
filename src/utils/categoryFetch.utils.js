const { prisma } = require("../../prisma/client/prisma-client");

async function categoryFetch(take, id) {
  const posts = await prisma.post.findMany({
    take,
    where: {
      content: {
        id,
      },
    },
    include: {
      location: {
        select: {
          name: true,
        },
      },
      content: {
        select: {
          name: true,
        },
      },
    },
  });

  return posts;
}

module.exports = { categoryFetch };
