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

    console.log(user);

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
  } catch (error) {
    console.log(error);
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

  if (user.role == "EDITOR") {
    if (user.suspended == true) {
      return res.status(401).send("You are suspended contact the admin");
    }
  }

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

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: `${process.env.HOST}`,
  service: `${process.env.SERVICE}`,
  port: 587,
  secure: false,
  auth: {
    user: `eabebe91@gmail.com`,
    pass: `fwajxenuqojkcbcb`,
  },
});

async function sendPasswordResetEmail(to, resetToken) {
  const resetLink = `${process.env.BASE_URL}/auth/reset?token=${resetToken}`;

  const mailOptions = {
    from: '"END media network" <no-reply@example.com>',
    to,
    subject: "Password Reset",
    html: `
      <p>We received a request to reset your password.</p>
      <p>If you made this request, click the link below to set a new password:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you didn't make this request, you can ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function forgotPasswordHandler(req, res) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return res.status(401).send({ error: "No user with that email found" });
    }

    const resetToken = signJWT({ email }, "2m");

    // Store the reset token and send the password reset email
    await sendPasswordResetEmail(email, resetToken);

    res.send({ message: "Password reset email sent" });
  } catch (error) {
    res.sendStatus(500);
  }
}

async function resetHandler(req, res) {
  console.log("hi");
  try {
    const { token, password } = req.body;
    console.log(password, token);

    const verify = verifyJWT(token);

    if (!verify.payload) return res.status(400).send({ token: "expired" });

    const email = verify.payload.email;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    const updatedUser = await prisma.user.update({
      where: { email: user.email },
      data: { password: hashedPassword },
    });

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
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
  forgotPasswordHandler,
  resetHandler,
};
