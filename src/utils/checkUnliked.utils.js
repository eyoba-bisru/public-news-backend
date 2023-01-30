const { prisma } = require("../../prisma/client/prisma-client");

async function checkUnliked(userId, postId) {
  let isUnliked = await prisma.unlike.findFirst({
    where: {
      userId,
      postId,
    },
  });

  if (isUnliked) return { isUnliked: true };
  else return { isUnliked: false };
}

module.exports = { checkUnliked };
