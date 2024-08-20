const printer = require("pdf-to-printer");

/**
 * Prints a PDF file using the default printer.
 * @param {string} filePath - The path to the PDF file to print.
 * @returns {Promise<void>}
 */
function printPdf(filePath) {
  return printer.print(filePath).catch((err) => {
    throw new Error(`Failed to print PDF file: ${err.message}`);
  });
}

module.exports = { printPdf };
