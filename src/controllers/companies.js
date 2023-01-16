const { prisma } = require("../../prisma/client/prisma-client");

const bcrypt = require("bcrypt");

const { upload } = require("../utils/imageUpload.utils");

const { unlink } = require("fs");

async function fetchCompanyHandler(req, res) {
  const companies = await prisma.user.findMany({
    where: {
      role: "EDITOR",
    },
  });

  res.send(companies);
}

async function updateEditorHandler(req, res) {
  try {
    const { role } = req.user;

    if (role != "ADMIN") return res.sendStatus(401);

    const {
      name,
      email,
      password,
      phoneNumber,
      shortName,
      id,
      oldLogo,
      oldPassword,
    } = req.body;

    console.log(req.exist);
    let logo = oldLogo;
    if (req.exist) {
      const files = req.files;
      logo = upload(files);
      unlink("public" + "/files/" + oldLogo, (err) => {
        if (err) console.log(err);
        else console.log("File Deleted");
      });
    }

    let hashedPass = "";
    if (!password) hashedPass = oldPassword;
    else hashedPass = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: {
        id,
      },

      data: {
        email,
        password: hashedPass,
        name,
        shortName,
        logo,
        phone: phoneNumber,
      },
    });

    res.send("Updated Successfull");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function fetchOneCompanyHandler(req, res) {
  try {
    const { id } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    res.send(user);
  } catch (error) {
    res.sendStatus(500);
  }
}

module.exports = {
  fetchCompanyHandler,
  updateEditorHandler,
  fetchOneCompanyHandler,
};
