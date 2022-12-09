const { Request, Response } = require("express");
const { createSession, getUser, invalidateSession } = require("../db");
const { signJWT, verifyJWT } = require("../utils/jwt.utils");
const bcrypt = require("bcrypt");

const { prisma } = require("../../prisma/client/prisma-client");

async function createUserHandler(req, res) {
  const { name, email, password, role, logo, shortName, phoneNumber } =
    req.body;

  if (role == "ADMIN") {
    return res.status(401).send("Admin cannot be registered");
  }

  if (role == "EDITOR" && (!logo || !shortName || !phoneNumber)) {
    return res.status(401).send("logo, short name and phone number required");
  }

  if (!name || !email || !password || !role) {
    return res.status(401).send("name, email and password required");
  }

  const usr = await getUser(email);

  if (usr) {
    return res.status(401).send("User already exist");
  }

  const hashedPass = await bcrypt.hash(password, 10);

  let user = {};

  if (role == "EDITOR") {
    user = await prisma.user.create({
      data: {
        email,
        password: hashedPass,
        name,
        role,
        logo,
        shortName,
        phone: phoneNumber,
      },
    });
  } else {
    user = await prisma.user.create({
      data: {
        email,
        password: hashedPass,
        name,
        role,
      },
    });
  }

  const session = createSession(user.email, user.name, user.role);

  // create access token
  const accessToken = signJWT(
    {
      email: user.email,
      name: user.name,
      role: user.role,
      sessionId: session.sessionId,
    },
    "5s"
  );

  const refreshToken = signJWT({ sessionId: session.sessionId }, "1y");

  // set access token in cookie
  res.cookie("accessToken", accessToken, {
    maxAge: 300000, // 5 minutes
    httpOnly: true,
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 3.154e10, // 1 year
    httpOnly: true,
  });

  // send user back
  return res.send(session);
}

// login handler
async function createSessionHandler(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(401).send("name, email and password required");

  const user = await getUser(email);

  if (!user) return res.status(401).send("Invalid email or password");

  const pass = await bcrypt.compare(password, user.password);

  if (!pass) return res.status(401).send("Invalid email or password");

  const session = createSession(user.email, user.name, user.role);

  // create access token
  const accessToken = signJWT(
    {
      email: user.email,
      name: user.name,
      role: user.role,
      sessionId: session.sessionId,
    },
    "5s"
  );

  const refreshToken = signJWT({ sessionId: session.sessionId }, "1y");

  // set access token in cookie
  res.cookie("accessToken", accessToken, {
    maxAge: 300000, // 5 minutes
    httpOnly: true,
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 3.154e10, // 1 year
    httpOnly: true,
  });

  // send user back
  return res.send(session);
}

// get the session session

// log out handler
function getSessionHandler(req, res) {
  return res.send(req.user);
}

function deleteSessionHandler(req, res) {
  res.cookie("accessToken", "", {
    maxAge: 0,
    httpOnly: true,
  });

  res.cookie("refreshToken", "", {
    maxAge: 0,
    httpOnly: true,
  });

  const session = invalidateSession(req.user.sessionId);

  return res.send(session);
}

module.exports = {
  deleteSessionHandler,
  getSessionHandler,
  createSessionHandler,
  createUserHandler,
};
