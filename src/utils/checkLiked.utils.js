const { prisma } = require("../../prisma/client/prisma-client");

async function checkLiked(userId, postId) {
  let isLiked = await prisma.like.findFirst({
    where: {
      userId,
      postId,
    },
    include: {
      post: {
        select: {
          id: true,
        },
      },
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  if (isLiked) return { isLiked: true };
  else return { isLiked: false };
}

module.exports = { checkLiked };
