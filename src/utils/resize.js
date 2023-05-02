const fs = require("fs");
const sharp = require("sharp");

module.exports = function resize(path, toFormat, width, height, fit) {
  const readStream = fs.createReadStream(path);
  let transform = sharp();
  if (toFormat) {
    transform = transform.toFormat(toFormat);
  }
  if (width || height) {
    transform = transform.resize(width, height, {
      withoutEnlargement: true,
      fit: fit || "cover",
    });
  }
  return readStream.pipe(transform);
};
