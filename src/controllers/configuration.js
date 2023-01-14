const { prisma } = require('../../prisma/client/prisma-client')

async function addContentHandler(req, res) {
  const { name } = req.body

  if (!name) return res.sendStatus(400)

  try {
    const content = await prisma.content.create({
      data: {
        name,
      },
    })

    res.send(content)
  } catch (error) {
    if (error.code == 'P2002')
      return res.status(400).send('Content already exist')
    res.sendStatus(500)
  }
}
async function addLanguageHandler(req, res) {
  const { name } = req.body

  if (!name) return res.sendStatus(400)

  try {
    const language = await prisma.language.create({
      data: {
        name,
      },
    })
    res.send(language)
  } catch (error) {
    if (error.code == 'P2002')
      return res.status(400).send('Language already exist')
    res.sendStatus(500)
  }
}
async function addLocationHandler(req, res) {
  const { name } = req.body

  if (!name) return res.sendStatus(400)

  try {
    const location = await prisma.location.create({
      data: {
        name,
      },
    })

    res.send(location)
  } catch (error) {
    if (error.code == 'P2002')
      return res.status(400).send('Location already exist')
    res.sendStatus(500)
  }
}
async function sitemapHandler(req, res) {
  try {
    const contents = await prisma.content.findMany({
      select: {
        id: true,
        name: true,
      },
    })
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    locations.forEach((location) => (location['type'] = 'location'))
    contents.forEach((content) => (content['type'] = 'content'))

    res.send([...locations, ...contents])
  } catch (error) {
    res.sendStatus(500)
  }
}

async function languageHandler(req, res) {
  try {
    const languages = await prisma.language.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    languages.forEach((language) => (language['type'] = 'language'))

    res.send(languages)
  } catch (error) {
    res.sendStatus(500)
  }
}

async function allHandler(req, res) {
  try {
    const languages = await prisma.language.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    const contents = await prisma.content.findMany({
      select: {
        id: true,
        name: true,
      },
    })
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    languages.forEach((language) => (language['type'] = 'language'))
    locations.forEach((location) => (location['type'] = 'location'))
    contents.forEach((content) => (content['type'] = 'content'))

    res.send([...contents, ...languages, ...locations])
  } catch (error) {
    res.sendStatus(500)
  }
}

async function contentsHandler(req, res) {
  try {
    const contents = await prisma.content.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    contents.forEach((content) => (content['type'] = 'content'))

    res.send(contents)
  } catch (error) {
    res.sendStatus(500)
  }
}

async function locationsHandler(req, res) {
  try {
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    locations.forEach((location) => (location['type'] = 'location'))

    res.send(locations)
  } catch (error) {
    res.sendStatus(500)
  }
}

async function handleDeleteLanguage(req, res) {
  try {
    const { id } = req.body

    const deletedLanguage = await prisma.language.delete({
      where: {
        id,
      },
    })

    res.send(deletedLanguage)
  } catch (error) {
    res.sendStatus(500)
  }
}

async function handleDeleteLocation(req, res) {
  try {
    const { id } = req.body

    const deletedLocation = await prisma.location.delete({
      where: {
        id,
      },
    })

    res.send(deletedLocation)
  } catch (error) {
    res.sendStatus(500)
  }
}

async function handleDeleteContent(req, res) {
  try {
    const { id } = req.body

    const deletedContent = await prisma.content.delete({
      where: {
        id,
      },
    })

    res.send(deletedContent)
  } catch (error) {
    res.sendStatus(500)
  }
}

async function handleEditContent(req, res) {
  try {
    const { id, name } = req.body

    const updatedContent = await prisma.content.update({
      where: {
        id,
      },
      data: {
        name,
      },
    })

    res.send(updatedContent)
  } catch (error) {
    res.sendStatus(500)
  }
}

async function handleEditLocation(req, res) {
  try {
    const { id, name } = req.body

    const updatedLocation = await prisma.location.update({
      where: {
        id,
      },
      data: {
        name,
      },
    })

    res.send(updatedLocation)
  } catch (error) {
    res.sendStatus(500)
  }
}

async function handleEditLanguage(req, res) {
  try {
    const { id, name } = req.body

    const updatedLanguage = await prisma.language.update({
      where: {
        id,
      },
      data: {
        name,
      },
    })

    res.send(updatedLanguage)
  } catch (error) {
    res.sendStatus(500)
  }
}

module.exports = {
  addContentHandler,
  addLanguageHandler,
  addLocationHandler,
  sitemapHandler,
  languageHandler,
  allHandler,
  contentsHandler,
  locationsHandler,
  handleDeleteContent,
  handleDeleteLanguage,
  handleDeleteLocation,
  handleEditContent,
  handleEditLanguage,
  handleEditLocation,
}
