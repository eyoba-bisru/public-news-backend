const { prisma } = require("../../prisma/client/prisma-client");

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

function createSession(id, email, name, role, verified, logo) {
  const sessionId = String(Object.keys(sessions).length + 1);

  const session = {
    sessionId,
    id,
    email,
    verified,
    name,
    role,
    logo,
    valid: true,
  };

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
