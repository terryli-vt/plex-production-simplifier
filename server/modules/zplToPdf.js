const fs = require("fs");
const request = require("request");

/**
 * Converts ZPL to PDF and saves it to a file.
 * @param {string} zpl - The ZPL string to convert.
 * @param {string} outputFilePath - The path to save the resulting PDF.
 * @param {number} density - The printer density (in dots per mm).
 * @param {string} size - The label size (e.g. "4x6").
 * @returns {Promise<void>}
 */
function convertZplToPdf(zpl, outputFilePath, density, size) {
  return new Promise((resolve, reject) => {
    const options = {
      encoding: null,
      formData: { file: zpl },
      headers: { Accept: "application/pdf" },
      url: `http://api.labelary.com/v1/printers/${density}dpmm/labels/${size}/0/`,
    };

    request.post(options, function (err, resp, body) {
      if (err) {
        console.log("Error converting ZPL to PDF.");
        return reject(err);
      }

      fs.writeFile(outputFilePath, body, function (err) {
        if (err) {
          console.log("Error saving PDF file.");
          return reject(err);
        }
        resolve();
      });
    });
  });
}

module.exports = { convertZplToPdf };
