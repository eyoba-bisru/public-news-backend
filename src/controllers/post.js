const { prisma } = require("../../prisma/client/prisma-client");

async function postsHomeHandler(req, res) {
  try {
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
  } catch (error) {
    res.sendStatus(500);
  }
}

async function addPostHandler(req, res) {
  const { email, role } = req.user;

  if (!email) return res.status(401).send("Permission denied");

  if (role != "EDITOR") return res.status(401).send("Permission denied");

  try {
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
  } catch (error) {
    res.sendStatus(500);
  }
}

async function loadMoreHandler(req, res) {
  const { contentId, id } = req.body;

  if (!contentId) return res.sendStatus(400);
  if (!id) return res.sendStatus(400);

  try {
    const posts = await prisma.post.findMany({
      where: {
        contentId,
      },
      take: 4,
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
  } catch (error) {
    res.sendStatus(500);
  }
}

async function postsCategoryHandler(req, res) {
  const { name } = req.body;

  if (!name) return res.sendStatus(400);

  try {
    const { id: contentId } = await prisma.content.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    const posts = await prisma.post.findMany({
      take: 6,
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
  } catch (error) {
    res.status(404).send("Category doesn't found");
  }
}
async function contentPostsHandler(req, res) {
  const { name } = req.body;

  if (!name) return res.sendStatus(400);

  try {
    const posts = await prisma.post.findMany({
      take: 6,
      where: {
        content: {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      include: {
        content: {
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
  } catch (error) {
    res.status(404).send("Category doesn't found");
  }
}
async function languagePostsHandler(req, res) {
  const { name } = req.body;

  if (!name) return res.sendStatus(400);

  try {
    const posts = await prisma.post.findMany({
      take: 6,
      where: {
        language: {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      include: {
        language: {
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
  } catch (error) {
    res.status(404).send("Category doesn't found");
  }
}
async function locationPostsHandler(req, res) {
  const { name } = req.body;

  if (!name) return res.sendStatus(400);

  try {
    const posts = await prisma.post.findMany({
      take: 6,
      where: {
        location: {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
      },
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
  } catch (error) {
    res.status(404).send("Category doesn't found");
  }
}

async function postHandler(req, res) {
  const { id } = req.body;

  if (!id) return res.sendStatus(400);

  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        content: {
          select: {
            id: true,
          },
        },
      },
    });

    res.send(post);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function recommendedHandler(req, res) {
  const { id, contentId } = req.body;

  if (!id) return res.sendStatus(400);
  if (!contentId) return res.sendStatus(400);

  try {
    const recommended = await prisma.post.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        imageUrl: true,
      },
      where: {
        contentId,
        NOT: {
          id,
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });

    res.send(recommended);
  } catch (error) {
    res.sendStatus(500);
  }
}

module.exports = {
  postsHomeHandler,
  addPostHandler,
  loadMoreHandler,
  postsCategoryHandler,
  postHandler,
  recommendedHandler,
  contentPostsHandler,
  languagePostsHandler,
  locationPostsHandler,
};
