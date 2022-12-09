const { prisma } = require("../../prisma/client/prisma-client");

const users = [
  {
    email: "test@test.com",
    password: "password",
    name: "Jane Doe",
  },
];

const sessions = {};

function getSession(sessionId) {
  const session = sessions[sessionId];

  return session && session.valid ? session : null;
}

function invalidateSession(sessionId) {
  const session = sessions[sessionId];

  if (session) {
    sessions[sessionId].valid = false;
  }

  return sessions[sessionId];
}

function createSession(email, name, role) {
  const sessionId = String(Object.keys(sessions).length + 1);

  const session = { sessionId, email, valid: true, name, role };

  sessions[sessionId] = session;

  return session;
}

async function getUser(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
}

module.exports = {
  getUser,
  getSession,
  createSession,
  invalidateSession,
  sessions,
};
