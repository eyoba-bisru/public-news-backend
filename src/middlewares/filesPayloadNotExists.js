const filesPayloadNotExists = (req, res, next) => {
  if (!req.files) req.exists = false;
  else req.exists = true;

  next();
};

module.exports = filesPayloadNotExists;
