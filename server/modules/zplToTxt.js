const fs = require("fs");

function writeZplCodeToTxt(zplcode, filePath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, zplcode, "utf8", (err) => {
      if (err) {
        return reject(
          new Error(`Failed to write ZPL code to text file: ${err.message}`)
        );
      }
      resolve(filePath);
    });
  });
}

module.exports = writeZplCodeToTxt;
