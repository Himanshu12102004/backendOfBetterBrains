const changePasswordSchema = require("../Schemas/changePassword");
const jwt = require("jsonwebtoken");
const userSchema = require("../Schemas/schema");
const sendMail = require("./smtp");

const changePasswordOtp = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await userSchema.findOne({ email });
    if (user.googleID != "") throw new Error("no such user");
    if (await changePasswordSchema.findOne({ _id: user._id }))
      throw new Error(
        "Password reset process has already been initiated try again after some time"
      );
    if (user) {
      const changePasswordUser = await changePasswordSchema.create({
        _id: user._id,
        email,
      });
      const emailBody = "Your otp for password reset is";
      const subject = "OTP for password reset";
      sendMail(user._id, email, emailBody, subject, 1, changePasswordSchema);
      const otpJwt = () => {
        return jwt.sign({ id: user._id }, process.env.PASSWORD_RESET_SECRET, {
          expiresIn: "3m",
        });
      };
      const generatedToken = otpJwt();
      res.json({ message: "sent", token: generatedToken });
    } else {
      throw new Error("no such user");
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
module.exports = changePasswordOtp;
