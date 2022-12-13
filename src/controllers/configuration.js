const { prisma } = require("../../prisma/client/prisma-client");

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
async function sitemapHandler(req, res) {
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

  res.send([...locations, ...contents]);
}

async function languageHandler(req, res) {
  const languages = await prisma.language.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  res.send(languages);
}

async function allHandler(req, res) {
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

  res.send([...contents, ...languages, ...locations]);
}

module.exports = {
  addContentHandler,
  addLanguageHandler,
  addLocationHandler,
  sitemapHandler,
  languageHandler,
  allHandler,
};
