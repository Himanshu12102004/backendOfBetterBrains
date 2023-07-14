const mongoose = require("mongoose");
const schema = mongoose.Schema({
  hasEnteredOtp: { default: false, type: Boolean },
  createdAt: { type: Date, expires: "3m", default: Date.now },
  email: { type: String },
  otp: { type: String },
});
module.exports = mongoose.model("changePassword", schema);
