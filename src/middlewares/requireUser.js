function requireUser(req, res, next) {
  // @ts-ignore
  if (!req.user) {
    return res.status(403).send("Invalid session");
  }

  return next();
}

module.exports = { requireUser };
