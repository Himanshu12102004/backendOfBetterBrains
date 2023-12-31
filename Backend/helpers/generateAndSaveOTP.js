const temporaryModel = require("../Schemas/temporaryUsers");

const bcrypt = require("bcrypt");
function generateOtp() {
  const min = 100000; // Minimum 6-digit number (inclusive)
  const max = 999999; // Maximum 6-digit number (inclusive)

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const otpGenerator = require("otp-generator");

const saveOtp = async (otp, email, model) => {
  const salt = await bcrypt.genSalt();
  otp = "" + otp;
  console.log(model, email);
  try {
    console.log(email);
    const user = await model.findOne({ email });
    otp = await bcrypt.hash(otp, salt);
    // console.log(user);
    console.log(await model.updateOne({ email: email }, { $set: { otp } }));
  } catch (err) {
    console.log(err);
  }
};
module.exports = { generateOtp, saveOtp };
