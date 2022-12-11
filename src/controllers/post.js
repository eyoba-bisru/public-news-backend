const { prisma } = require("../../prisma/client/prisma-client");

async function postsHomeHandler(req, res) {
  const posts = await prisma.post.findMany({
    take: 16,
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    include: {
      location: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          shortName: true,
        },
      },
    },
  });

  res.send(posts);
}

async function addPostHandler(req, res) {
  const { email, role } = req.user;

  if (role != "EDITOR") {
    return res.status(401).send("Permission denied");
  }

  const { id: userId } = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  const {
    description,
    imageUrl,
    title,
    contentId,
    languageId,
    locationId,
    videoUrl,
  } = req.body;

  const post = await prisma.post.create({
    data: {
      description,
      imageUrl,
      title,
      contentId,
      languageId,
      locationId,
      userId,
      videoUrl,
    },
  });

  res.send(post);
}
async function addContentHandler(req, res) {
  const { name } = req.body;

  const content = await prisma.content.create({
    data: {
      name,
    },
  });

  res.send(content);
}
async function addLanguageHandler(req, res) {
  const { name } = req.body;

  const language = await prisma.language.create({
    data: {
      name,
    },
  });

  res.send(language);
}
async function addLocationHandler(req, res) {
  const { name } = req.body;

  const location = await prisma.location.create({
    data: {
      name,
    },
  });

  res.send(location);
}

async function loadMoreHandler(req, res) {
  const { contentId, id } = req.body;

  const posts = await prisma.post.findMany({
    where: {
      contentId,
    },
    take: 2,
    cursor: {
      id,
    },
    skip: 1,
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  res.send(posts);
}

async function postsCategoryHandler(req, res) {
  const { name } = req.body;

  const { id: contentId } = await prisma.content.findUnique({
    where: {
      name,
    },
  });

  const posts = await prisma.post.findMany({
    take: 2,
    where: {
      contentId,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  res.send(posts);
}

module.exports = {
  postsHomeHandler,
  addContentHandler,
  addLanguageHandler,
  addPostHandler,
  addLocationHandler,
  loadMoreHandler,
  postsCategoryHandler,
};
