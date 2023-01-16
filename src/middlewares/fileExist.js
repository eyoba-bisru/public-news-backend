const fileExist = (req, res, next) => {
  console.log(req.files);
  if (!req.files) req.exist = false;
  else req.exist = true;

  next();
};

module.exports = fileExist;
