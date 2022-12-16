const { createSession, getUser, invalidateSession } = require("../db");
const { signJWT, verifyJWT } = require("../utils/jwt.utils");
const bcrypt = require("bcrypt");
const { sendMail } = require("../utils/email.utils");

const { prisma } = require("../../prisma/client/prisma-client");

async function createUserHandler(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(401).send("name, email and password required");
  }

  const usr = await getUser(email);

  if (usr) {
    return res.status(401).send("User already exist");
  }

  try {
    const hashedPass = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPass,
        name,
      },
    });

    const session = createSession(user.email, user.name, user.role, false);

    await sendMail(user.email, user.name, user.role, session.sessionId);

    // create access token
    const accessToken = signJWT(
      {
        email: user.email,
        name: user.name,
        role: user.role,
        verified: false,
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
  } catch (error) {
    res.sendStatus(500);
  }
}

async function createEditorHandler(req, res) {
  const { role } = req.user;

  if (role != "ADMIN") return res.sendStatus(401);

  const { name, email, password, logo, shortName, phoneNumber } = req.body;

  if (!logo || !shortName || !phoneNumber)
    return res.status(400).send("logo, short name and phone number required");

  if (!name || !email || !password)
    return res.status(400).send("name, email and password required");

  const usr = await getUser(email);

  if (usr) {
    return res.status(409).send("User already exist");
  }

  try {
    const hashedPass = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPass,
        name,
        role: "EDITOR",
        logo,
        shortName,
        verified: true,
        phone: phoneNumber,
      },
    });

    // const session = createSession(user.email, user.name, "EDITOR", false);

    // await sendMail(user.email, user.name, "EDITOR", session.sessionId);

    // const accessToken = signJWT(
    //   {
    //     email: user.email,
    //     name: user.name,
    //     role: "EDITOR",
    //     verified: false,
    //     sessionId: session.sessionId,
    //   },
    //   "5s"
    // );

    // const refreshToken = signJWT({ sessionId: session.sessionId }, "1y");

    res.send("Registered Successfull");
  } catch (error) {
    res.sendStatus(500);
  }
}

async function loginHandler(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(401).send("name, email and password required");

  const user = await getUser(email);

  if (!user) return res.status(401).send("Invalid email or password");

  const pass = await bcrypt.compare(password, user.password);

  if (!pass) return res.status(401).send("Invalid email or password");

  const session = createSession(
    user.email,
    user.name,
    user.role,
    user.verified
  );

  // create access token
  const accessToken = signJWT(
    {
      email: user.email,
      name: user.name,
      role: user.role,
      verified: user.verified,
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

async function verificationHandler(req, res) {
  const email = req.params.email;
  const token = req.params.token;

  const { payload, expired } = verifyJWT(token);

  if (expired) return res.status(401).send("Link expired");

  if (!payload) return res.status(404).send("Invalid link");

  if (payload.email != email) res.status(401).send("Invalid link");

  const user = await prisma.user.update({
    data: {
      verified: true,
    },
    where: {
      email,
    },
  });

  const session = createSession(user.email, user.name, user.role, true);

  // create access token
  const accessToken = signJWT(
    {
      email: user.email,
      name: user.name,
      role: user.role,
      verified: true,
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

  res.send("Verified successfully");
}

async function resendMail(req, res) {
  const user = req.user;
  await sendMail(user.email, user.name, user.role, user.sessionId);
  res.send("verify");
}

module.exports = {
  deleteSessionHandler,
  getSessionHandler,
  loginHandler,
  createUserHandler,
  verificationHandler,
  resendMail,
  createEditorHandler,
};
