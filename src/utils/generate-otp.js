const nanoid = require("nanoid");

const otp = nanoid.customAlphabet("0123456789", 4);

module.exports = otp;
