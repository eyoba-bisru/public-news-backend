const { prisma } = require("../../prisma/client/prisma-client");

async function addContentHandler(req, res) {
  const { name } = req.body;

  if (!name) return res.sendStatus(400);

  try {
    const content = await prisma.content.create({
      data: {
        name,
      },
    });

    res.send(content);
  } catch (error) {
    if (error.code == "P2002")
      return res.status(400).send("Content already exist");
    res.sendStatus(500);
  }
}
async function addLanguageHandler(req, res) {
  const { name } = req.body;

  if (!name) return res.sendStatus(400);

  try {
    const language = await prisma.language.create({
      data: {
        name,
      },
    });
    res.send(language);
  } catch (error) {
    if (error.code == "P2002")
      return res.status(400).send("Language already exist");
    res.sendStatus(500);
  }
}
async function addLocationHandler(req, res) {
  const { name } = req.body;

  if (!name) return res.sendStatus(400);

  try {
    const location = await prisma.location.create({
      data: {
        name,
      },
    });

    res.send(location);
  } catch (error) {
    if (error.code == "P2002")
      return res.status(400).send("Location already exist");
    res.sendStatus(500);
  }
}
async function sitemapHandler(req, res) {
  try {
    const contents = await prisma.content.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    locations.forEach((location) => (location["type"] = "location"));
    contents.forEach((content) => (content["type"] = "content"));

    res.send([...locations, ...contents]);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function languageHandler(req, res) {
  try {
    const languages = await prisma.language.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    languages.forEach((language) => (language["type"] = "language"));

    res.send(languages);
  } catch (error) {
    res.sendStatus(500);
  }
}

async function allHandler(req, res) {
  try {
    const languages = await prisma.language.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const contents = await prisma.content.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    languages.forEach((language) => (language["type"] = "language"));
    locations.forEach((location) => (location["type"] = "location"));
    contents.forEach((content) => (content["type"] = "content"));

    res.send([...contents, ...languages, ...locations]);
  } catch (error) {
    res.sendStatus(500);
  }
}

module.exports = {
  addContentHandler,
  addLanguageHandler,
  addLocationHandler,
  sitemapHandler,
  languageHandler,
  allHandler,
};
