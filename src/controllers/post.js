const { prisma } = require('../../prisma/client/prisma-client')
const { categoryFetch } = require('../utils/categoryFetch.utils')
const { checkLiked } = require('../utils/checkLiked.utils')
const { checkUnliked } = require('../utils/checkUnliked.utils')
const { upload } = require('../utils/imageUpload.utils')

async function postsHomeHandler(req, res) {
  try {
    const user = req?.user
    if (user) {
      const customize = await prisma.customize.findMany({
        where: {
          userId: user.id,
        },
        select: {
          contentId: true,
        },
      })

      console.log(user)
      let length = customize.length

      console.log(length)

      if (length == 0) {
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
            content: {
              select: {
                name: true,
              },
            },
          },
        })
        return res.send(posts)
      }

      let sport = Math.round(
        (customize.filter((c) => c.contentId == 2).length * 16) / length
      )
      let health = Math.round(
        (customize.filter((c) => c.contentId == 3).length * 16) / length
      )
      let sciTech = Math.round(
        (customize.filter((c) => c.contentId == 4).length * 16) / length
      )
      let educ = Math.round(
        (customize.filter((c) => c.contentId == 8).length * 16) / length
      )
      let bussiness = Math.round(
        (customize.filter((c) => c.contentId == 9).length * 16) / length
      )
      let culture = Math.round(
        (customize.filter((c) => c.contentId == 10).length * 16) / length
      )
      let politics = Math.round(
        (customize.filter((c) => c.contentId == 12).length * 16) / length
      )

      const sports = await categoryFetch(sport, 2)
      const healths = await categoryFetch(health, 3)
      const sciTechs = await categoryFetch(sciTech, 4)
      const educs = await categoryFetch(educ, 8)
      const bussinesses = await categoryFetch(bussiness, 9)
      const cultures = await categoryFetch(culture, 10)
      const politicses = await categoryFetch(politics, 12)

      const total = [
        ...sports,
        ...healths,
        ...sciTechs,
        ...educs,
        ...bussinesses,
        ...cultures,
        ...politicses,
      ]
      // console.log(total);

      return res.send(total)
    }

    console.log('not user')
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
        content: {
          select: {
            name: true,
          },
        },
      },
    })

    res.send(posts)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function addPostHandler(req, res) {
  const { email, role } = req.user

  if (!email) return res.status(401).send('Permission denied')

  if (role != 'EDITOR') return res.status(401).send('Permission denied')

  try {
    const { id: userId } = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    let { description, title, contentId, languageId, locationId, sources } =
      req.body

    contentId = parseInt(contentId)
    languageId = parseInt(languageId)
    locationId = parseInt(locationId)
    const files = req.files

    const imageUrl = upload(files)

    const post = await prisma.post.create({
      data: {
        description,
        imageUrl,
        title,
        contentId,
        languageId,
        locationId,
        userId,
        sources,
      },
    })

    res.send(post)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function loadMoreHandler(req, res) {
  let { contentId, id } = req.body
  contentId = parseInt(contentId)
  id = parseInt(id)

  if (!contentId) return res.sendStatus(400)
  if (!id) return res.sendStatus(400)

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
          createdAt: 'desc',
        },
      ],
    })

    res.send(posts)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function loadMoreLanguageHandler(req, res) {
  let { languageId, id } = req.body
  languageId = parseInt(languageId)
  id = parseInt(id)

  if (!languageId) return res.sendStatus(400)
  if (!id) return res.sendStatus(400)

  try {
    const posts = await prisma.post.findMany({
      where: {
        languageId,
      },
      take: 4,
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
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}
async function loadMoreLocationHandler(req, res) {
  let { locationId, id } = req.body
  locationId = parseInt(locationId)
  id = parseInt(id)

  console.log(locationId, id)

  if (!locationId) return res.sendStatus(400)
  if (!id) return res.sendStatus(400)

  try {
    const posts = await prisma.post.findMany({
      where: {
        locationId,
      },
      take: 4,
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
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function postsCategoryHandler(req, res) {
  const { name } = req.body

  if (!name) return res.sendStatus(400)

  try {
    const { id: contentId } = await prisma.content.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    })

    const posts = await prisma.post.findMany({
      take: 6,
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
  } catch (error) {
    console.log(error)
    res.status(404).send("Category doesn't found")
  }
}

async function contentPostsHandler(req, res) {
  const { name } = req.body

  if (!name) return res.sendStatus(400)

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
          createdAt: 'desc',
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
    })

    const count = await prisma.post.count({
      where: {
        content: {
          name,
        },
      },
    })
    res.send({ posts, count })
  } catch (error) {
    res.status(404).send("Category doesn't found")
  }
}
async function languagePostsHandler(req, res) {
  const { name } = req.body

  if (!name) return res.sendStatus(400)

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
          createdAt: 'desc',
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
    })

    const count = await prisma.post.count({
      where: {
        language: {
          name,
        },
      },
    })
    res.send({ posts, count })
  } catch (error) {
    res.status(404).send("Category doesn't found")
  }
}
async function locationPostsHandler(req, res) {
  const { name } = req.body
  console.log(name)

  if (!name) return res.sendStatus(400)

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
          createdAt: 'desc',
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
    })
    const count = await prisma.post.count({
      where: {
        language: {
          name,
        },
      },
    })
    res.send({ posts, count })
  } catch (error) {
    console.log(error)
    res.status(404).send("Category doesn't found")
  }
}

async function postHandler(req, res) {
  let { id } = req.body
  id = parseInt(id)

  if (!id) return res.sendStatus(400)

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
        bookmark: {
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
        language: {
          select: {
            id: true,
          },
        },
        location: {
          select: {
            id: true,
          },
        },
      },
    })

    res.send(post)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function recommendedHandler(req, res) {
  const { id, contentId } = req.body

  if (!id) return res.sendStatus(400)
  if (!contentId) return res.sendStatus(400)

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
          createdAt: 'desc',
        },
      ],
    })

    res.send(recommended)
  } catch (error) {
    res.sendStatus(500)
  }
}

async function numOfPostsHandler(req, res) {
  const num = await prisma.post.count({})

  res.status(200).json(num)
}

async function bookmarkHandler(req, res) {
  try {
    let { userId, postId } = req.body

    postId = parseInt(postId)

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        postId,
      },
    })

    res.send(bookmark)
  } catch (error) {
    if (error.code === 'P2002') return res.status(500).send('Already added')
    console.log(error)
    res.sendStatus(500)
  }
}

async function removeBookmarkHandler(req, res) {
  try {
    let { userId, postId } = req.body

    postId = parseInt(postId)

    const bookmark = await prisma.bookmark.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    res.send(bookmark)
  } catch (error) {
    if (error.code === 'P2002') return res.status(500).send('Doesnot found')
    console.log(error)
    res.sendStatus(500)
  }
}

async function bookmarksHandler(req, res) {
  try {
    const { userId } = req.body
    const posts = await prisma.post.findMany({
      where: {
        bookmark: {
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
    })

    res.send(posts)
  } catch (error) {
    res.sendStatus(500)
  }
}

async function postedNewsHandler(req, res) {
  try {
    const { email } = req.user
    const { id } = await prisma.user.findUnique({
      where: {
        email,
      },
      select: { id: true },
    })
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
    })
    res.send(posts)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}
async function reportFetchHandler(req, res) {
  try {
    const { userId, postId, name } = req.body
    // console.log(userId)
    // console.log(postId)
    // console.log(name)
    // res.send(userId)
    const reports = await prisma.report.findMany({
      include: {
        post: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    })
    res.send(reports)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}
async function reportDeleteHandler(req, res) {
  try {
    let { id } = req.body
    reportId = parseInt(id)
    const deleteReport = await prisma.report.delete({
      where: {
        id: reportId,
      },
    })
    res.send(deleteReport)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function likeHandler(req, res) {
  try {
    const { id } = req.user
    let { postId } = req.body
    postId = parseInt(postId)

    let isLiked = await checkLiked(id, postId)
    let isUnliked = await checkUnliked(id, postId)

    if (!isUnliked.isUnliked) {
      if (isLiked.isLiked) {
        isLiked = await prisma.like.deleteMany({
          where: {
            userId: id,
            postId,
          },
        })
        return res.send({ isLiked: false })
      } else {
        isLiked = await prisma.like.create({
          data: {
            userId: id,
            postId,
          },
        })
        console.log('added')
        return res.send({ isLiked: true })
      }
    } else {
      isUnliked = await prisma.unlike.deleteMany({
        where: {
          userId: id,
          postId,
        },
      })

      isLiked = await prisma.like.create({
        data: {
          userId: id,
          postId,
        },
      })
      console.log('added')
      return res.send({ isLiked: true })
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function isLikedHandler(req, res) {
  try {
    const { id } = req.user
    let { postId } = req.body
    postId = parseInt(postId)

    const isLiked = await checkLiked(id, postId)

    res.send(isLiked)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function numOfLikedHandler(req, res) {
  try {
    let { postId } = req.body
    postId = parseInt(postId)

    const num = await prisma.like.count({
      where: {
        postId,
      },
    })

    res.json({ num })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function unlikeHandler(req, res) {
  try {
    const { id } = req.user
    let { postId } = req.body
    postId = parseInt(postId)

    let isLiked = await checkLiked(id, postId)
    let isUnliked = await checkUnliked(id, postId)

    if (!isLiked.isLiked) {
      if (isUnliked.isUnliked) {
        isUnliked = await prisma.unlike.deleteMany({
          where: {
            userId: id,
            postId,
          },
        })
        return res.json({ isUnliked: false })
      } else {
        isUnliked = await prisma.unlike.create({
          data: {
            userId: id,
            postId,
          },
        })
        console.log('added')
        return res.send({ isUnliked: true })
      }
    } else {
      await prisma.like.deleteMany({
        where: {
          userId: id,
          postId,
        },
      })
      console.log('removed')

      isUnliked = await prisma.unlike.create({
        data: {
          userId: id,
          postId,
        },
      })

      return res.send({ isUnliked: true })
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function isUnlikedHandler(req, res) {
  try {
    const { id } = req.user
    let { postId } = req.body
    postId = parseInt(postId)

    const isUnliked = await checkUnliked(id, postId)

    res.send(isUnliked)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function commentsHandler(req, res) {
  try {
    const { id } = req.user
    let { postId, name } = req.body
    postId = parseInt(postId)

    console.log(name)

    const comment = await prisma.comment.create({
      data: {
        name,
        postId,
        userId: id,
      },
    })

    res.send(comment)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}
async function reportsHandler(req, res) {
  try {
    const { id } = req.user
    let { postId, name } = req.body
    postId = parseInt(postId)
    const report = await prisma.report.create({
      data: {
        name,
        postId,
        userId: id,
      },
    })
    res.send(report)
    console.log(name)
  } catch (error) {
    console.log(error)
    console.log('hi error')
    res.sendStatus(500)
  }
}

async function getAllCommentsHandler(req, res) {
  try {
    let { postId } = req.body

    postId = parseInt(postId)

    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    res.send(comments)
  } catch (error) {
    res.sendStatus(500)
  }
}

async function customizeHandler(req, res) {
  try {
    const { id } = req.user
    let { contentId } = req.body

    contentId = parseInt(contentId)

    const customize = await prisma.customize.create({
      data: {
        userId: id,
        contentId,
      },
    })

    res.send(customize)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function searchHandler(req, res) {
  try {
    const { q } = req.body
    const content = await prisma.post.findMany({
      where: {
        content: {
          name: {
            contains: q,
          },
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
    })

    const location = await prisma.post.findMany({
      where: {
        location: {
          name: {
            contains: q,
          },
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
    })

    const title = await prisma.post.findMany({
      where: {
        title: {
          contains: q,
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
    })

    const description = await prisma.post.findMany({
      where: {
        description: {
          contains: q,
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
    })

    let all = [...title, ...description, ...content, ...location]

    all = all.map((item, pos) => {
      return JSON.stringify(item)
    })

    all = all.filter((item, pos) => all.indexOf(item) == pos)

    all = all.map((item, pos) => {
      return JSON.parse(item)
    })

    res.send(all)
  } catch (error) {
    res.sendStatus(500)
  }
}

async function analyticsHandler(req, res) {
  let sport = await prisma.post.count({
    where: {
      content: {
        name: 'Sport',
      },
    },
  })
  let bussiness = await prisma.post.count({
    where: {
      content: {
        name: 'Bussiness',
      },
    },
  })
  let culture = await prisma.post.count({
    where: {
      content: {
        name: 'Culture',
      },
    },
  })
  let health = await prisma.post.count({
    where: {
      content: {
        name: 'Health',
      },
    },
  })
  let education = await prisma.post.count({
    where: {
      content: {
        name: 'Education',
      },
    },
  })
  let sciTech = await prisma.post.count({
    where: {
      content: {
        name: 'Sci-Tech',
      },
    },
  })
  let politics = await prisma.post.count({
    where: {
      content: {
        name: 'Politics',
      },
    },
  })

  res.send([sport, health, sciTech, education, bussiness, culture, politics])
}

const fs = require('fs')
const path = require('path')
const { log } = require('console')

async function addVistorHandler(req, res) {
  let count = parseInt(fs.readFileSync('public/visitor.txt', 'utf-8'))
  count = count + 1 + ''
  fs.writeFileSync('public/visitor.txt', count)
  res.send('successfull')
}

async function visitorsHandler(req, res) {
  const count = parseInt(fs.readFileSync('public/visitor.txt', 'utf-8'))
  res.json(count)
}
async function deletePostHandler(req, res) {
  try {
    let { id } = req.body
    id = parseInt(id)
    const postDelete = await prisma.post.delete({
      where: {
        id,
      },
    })
    res.send(postDelete)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function deletePostHandler(req, res) {
  try {
    let { id } = req.body
    id = parseInt(id)
    const postDelete = await prisma.post.delete({
      where: {
        id,
      },
    })
    res.send(postDelete)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function handleEditPost(req, res) {
  const { email, role } = req.user
  if (!email) return res.status(401).send('Permission denied')

  if (role != 'EDITOR') return res.status(401).send('Permission denied')
  try {
    const userId = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    console.log(userId)
    let { id, description, title, contentId, languageId, locationId, sources } =
      req.body
    console.log(id)
    console.log(title)

    postsId = parseInt(id)
    contentId = parseInt(contentId)
    languageId = parseInt(languageId)
    locationId = parseInt(locationId)
    const files = req.files
    const imageUrl = upload(files)
    const updatedPost = await prisma.post.update({
      where: {
        id: postsId,
      },
      data: {
        title,
        description,
        imageUrl,
        contentId,
        languageId,
        locationId,
        sources,
      },
    })
    res.send(updatedPost)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}
module.exports = {
  postsHomeHandler,
  addPostHandler,
  loadMoreHandler,
  loadMoreLanguageHandler,
  loadMoreLocationHandler,
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
  commentsHandler,
  getAllCommentsHandler,
  reportsHandler,
  reportFetchHandler,
  reportDeleteHandler,
  customizeHandler,
  searchHandler,
  analyticsHandler,
  addVistorHandler,
  visitorsHandler,
  deletePostHandler,
  handleEditPost,
}
