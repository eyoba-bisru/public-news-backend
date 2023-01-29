const { createSession, getUser, invalidateSession } = require("../db");
const { signJWT, verifyJWT } = require("../utils/jwt.utils");
const bcrypt = require("bcrypt");
const { sendMail } = require("../utils/email.utils");

const { prisma } = require("../../prisma/client/prisma-client");
const { upload } = require("../utils/imageUpload.utils");

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

    const session = createSession(
      user.email,
      user.name,
      user.role,
      false,
      user.logo
    );

    await sendMail(user.email, user.name, user.role, session.sessionId);

    // create access token
    const accessToken = signJWT(
      {
        email: user.email,
        name: user.name,
        role: user.role,
        logo: user.logo,
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
  try {
    const { role } = req.user;

    if (role != "ADMIN") return res.sendStatus(401);

    const { name, email, password } = req.body;
    console.log(name, email, password);

    if (!name || !email || !password)
      return res.status(400).send("name, email and password required");

    const usr = await getUser(email);

    if (usr) {
      return res.status(409).send("User already exist");
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPass,
        name,
        role: "EDITOR",
      },
    });

    res.send("Registered Successfull");
  } catch (error) {
    console.log(error);
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
    user.id,
    user.email,
    user.name,
    user.role,
    user.logo
  );

  // create access token
  const accessToken = signJWT(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      logo: user.logo,
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

async function resendMail(req, res) {
  const user = req.user;
  await sendMail(user.email, user.name, user.role, user.sessionId);
  res.send("verify");
}

async function numOfSubsHandler(req, res) {
  const num = await prisma.user.count({
    where: {
      role: "USER",
    },
  });

  res.status(200).json(num);
}

async function changePasswordHandler(req, res) {
  try {
    const { email, password, oldPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        password: true,
      },
    });

    const pass = await bcrypt.compare(oldPassword, user.password);

    if (!pass) return res.status(401).send("Invalid password combination");

    const hashedPass = await bcrypt.hash(password, 10);

    const usr = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPass,
      },
    });

    res.send(usr);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}

module.exports = {
  deleteSessionHandler,
  getSessionHandler,
  loginHandler,
  createUserHandler,
  resendMail,
  createEditorHandler,
  numOfSubsHandler,
  changePasswordHandler,
};
