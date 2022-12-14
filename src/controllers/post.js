const { prisma } = require('../../prisma/client/prisma-client')

async function postsHomeHandler(req, res) {
  const posts = await prisma.post.findMany({
    take: 16,
    orderBy: [
      {
        createdAt: 'desc',
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
  })

  res.send(posts)
}

async function addPostHandler(req, res) {
  const { email, role } = req.user

  if (role != 'EDITOR') {
    return res.status(401).send('Permission denied')
  }

  const { id: userId } = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  const {
    description,
    imageUrl,
    title,
    contentId,
    languageId,
    locationId,
    videoUrl,
  } = req.body

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
  })

  res.send(post)
}

async function loadMoreHandler(req, res) {
  const { contentId, id } = req.body

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
        createdAt: 'desc',
      },
    ],
  })

  res.send(posts)
}

async function postsCategoryHandler(req, res) {
  const { name } = req.body

  const { id: contentId } = await prisma.content.findUnique({
    where: {
      name,
    },
  })

  const posts = await prisma.post.findMany({
    take: 2,
    where: {
      contentId,
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  })

  res.send(posts)
}

async function postHandler(req, res) {
  const { id } = req.body
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
  })

  res.send(post)
}
async function recommendationHandler(req, res) {
  const { id, contentId } = req.body
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
        createdAt: 'desc',
      },
    ],
  })

  res.send(recommended)
}
module.exports = {
  postsHomeHandler,
  addPostHandler,
  loadMoreHandler,
  postsCategoryHandler,
  postHandler,
  recommendationHandler,
}
