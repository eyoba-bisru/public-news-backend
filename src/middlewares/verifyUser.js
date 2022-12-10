function verifyUser(req, res, next) {
  if (req.user.verified == false)
    return res.status(403).send("Please verify your email");

  return next();
}

module.exports = { verifyUser };
