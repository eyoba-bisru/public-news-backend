const path = require("path");

function upload(files) {
  let file = "";
  Object.keys(files).forEach((key) => {
    const fileName = `${Date.now()}` + files[key].name;
    const filepath = path.join(__dirname, "../../public", "files", fileName);
    files[key].mv(filepath, (err) => {
      if (err) console.log(err);
    });
    file = fileName;
  });

  return file;
}

module.exports = { upload };
