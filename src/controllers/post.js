const { prisma } = require("../../prisma/client/prisma-client");
const { checkLiked } = require("../utils/checkLiked.utils");
const { checkUnliked } = require("../utils/checkUnliked.utils");
const { upload } = require("../utils/imageUpload.utils");

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
        // user: {
        //   select: {
        //     shortName: true,
        //   },
        // },
      },
    });

    res.send(posts);
  } catch (error) {
    console.log(error);
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

    let { description, title, contentId, languageId, locationId } = req.body;

    contentId = parseInt(contentId);
    languageId = parseInt(languageId);
    locationId = parseInt(locationId);
    const files = req.files;

    const imageUrl = upload(files);

    const post = await prisma.post.create({
      data: {
        description,
        imageUrl,
        title,
        contentId,
        languageId,
        locationId,
        userId,
      },
    });

    res.send(post);
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
            // mode: "insensitive",
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
            name: true,
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
            // mode: "insensitive",
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
            name: true,
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
  console.log(name);

  if (!name) return res.sendStatus(400);

  try {
    const posts = await prisma.post.findMany({
      take: 6,
      where: {
        location: {
          name: {
            equals: name,
            // mode: "insensitive",
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      include: {
        // location: {
        //   select: {
        //     name: true,
        //   },
        // },
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    res.send(posts);
  } catch (error) {
    console.log(error);
    res.status(404).send("Category doesn't found");
  }
}

async function postHandler(req, res) {
  let { id } = req.body;
  id = parseInt(id);

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
        Bookmark: {
          select: {
            userId: true,
            user: {
              select: {
                id: true,
              },
            },
            postId: true,
          },
        },
      },
    });

    res.send(post);
  } catch (error) {
    console.log(error);
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

async function numOfPostsHandler(req, res) {
  const num = await prisma.post.count({});

  res.status(200).json(num);
}

async function bookmarkHandler(req, res) {
  try {
    const { userId, postId } = req.body;

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        postId,
      },
    });

    res.send(bookmark);
  } catch (error) {
    if (error.code === "P2002") return res.status(500).send("Already added");
    res.sendStatus(500);
  }
}

async function removeBookmarkHandler(req, res) {
  try {
    const { userId, postId } = req.body;

    const bookmark = await prisma.bookmark.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    res.send(bookmark);
  } catch (error) {
    if (error.code === "P2002") return res.status(500).send("Doesnot found");
    console.log(error);
    res.sendStatus(500);
  }
}

async function bookmarksHandler(req, res) {
  try {
    const { userId } = req.body;
    const posts = await prisma.post.findMany({
      where: {
        Bookmark: {
          some: {
            userId,
          },
        },
      },
      include: {
        language: {
          select: {
            name: true,
          },
        },
      },
    });

    res.send(posts);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function postedNewsHandler(req, res) {
  try {
    const { email } = req.user;
    const { id } = await prisma.user.findUnique({
      where: {
        email,
      },
      select: { id: true },
    });
    const posts = await prisma.post.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        title: true,
        content: {
          select: {
            name: true,
          },
        },
        language: {
          select: {
            name: true,
          },
        },
        location: {
          select: {
            name: true,
          },
        },
      },
    });
    res.send(posts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function likeHandler(req, res) {
  try {
    const { id } = req.user;
    let { postId } = req.body;
    postId = parseInt(postId);

    let isLiked = await checkLiked(id, postId);
    let isUnliked = await checkUnliked(id, postId);

    if (!isUnliked.isUnliked) {
      if (isLiked.isLiked) {
        isLiked = await prisma.like.deleteMany({
          where: {
            userId: id,
            postId,
          },
        });
        return res.send({ isLiked: false });
      } else {
        isLiked = await prisma.like.create({
          data: {
            userId: id,
            postId,
          },
        });
        console.log("added");
        return res.send({ isLiked: true });
      }
    } else {
      isUnliked = await prisma.unlike.deleteMany({
        where: {
          userId: id,
          postId,
        },
      });

      isLiked = await prisma.like.create({
        data: {
          userId: id,
          postId,
        },
      });
      console.log("added");
      return res.send({ isLiked: true });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function isLikedHandler(req, res) {
  try {
    const { id } = req.user;
    let { postId } = req.body;
    postId = parseInt(postId);

    const isLiked = await checkLiked(id, postId);

    res.send(isLiked);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function numOfLikedHandler(req, res) {
  try {
    let { postId } = req.body;
    postId = parseInt(postId);

    const num = await prisma.like.count({
      where: {
        postId,
      },
    });

    res.json({ num });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function unlikeHandler(req, res) {
  try {
    const { id } = req.user;
    let { postId } = req.body;
    postId = parseInt(postId);

    let isLiked = await checkLiked(id, postId);
    let isUnliked = await checkUnliked(id, postId);

    if (!isLiked.isLiked) {
      if (isUnliked.isUnliked) {
        isUnliked = await prisma.unlike.deleteMany({
          where: {
            userId: id,
            postId,
          },
        });
        return res.json({ isUnliked: false });
      } else {
        isUnliked = await prisma.unlike.create({
          data: {
            userId: id,
            postId,
          },
        });
        console.log("added");
        return res.send({ isUnliked: true });
      }
    } else {
      await prisma.like.deleteMany({
        where: {
          userId: id,
          postId,
        },
      });
      console.log("removed");

      isUnliked = await prisma.unlike.create({
        data: {
          userId: id,
          postId,
        },
      });

      return res.send({ isUnliked: true });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function isUnlikedHandler(req, res) {
  try {
    const { id } = req.user;
    let { postId } = req.body;
    postId = parseInt(postId);

    const isUnliked = await checkUnliked(id, postId);

    res.send(isUnliked);
  } catch (error) {
    console.log(error);
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
  numOfPostsHandler,
  bookmarkHandler,
  removeBookmarkHandler,
  bookmarksHandler,
  postedNewsHandler,
  likeHandler,
  isLikedHandler,
  numOfLikedHandler,
  unlikeHandler,
  isUnlikedHandler,
};
