const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const permanentModel = require("../Schemas/schema");
const resetPasswordModel = require("../Schemas/changePassword");
const { createToken } = require("../controllers/jwtCreation");
const passwordResetOtpCheck = async (req, res) => {
  const myJwt = req.headers.authentication.split(" ")[1];
  const token = req.body.otp;
  // console.log(req.body);
  console.log(myJwt);
  console.log(token);
  // console.log(req.headers);
  try {
    jwt.verify(
      myJwt,
      process.env.PASSWORD_RESET_SECRET,
      async (err, jwtDecoded) => {
        try {
          console.log(jwtDecoded);

          let user = await resetPasswordModel.findById(jwtDecoded.id);
          console.log(user);
          console.log(jwtDecoded);
          if (user && (await bcrypt.compare(token, user.otp))) {
            await resetPasswordModel.updateOne(
              { _id: user._id },
              { $set: { hasEnteredOtp: true } }
            );

            res.json({ success: true });
          } else res.json({ error: "wrong otp", success: false });
        } catch (err) {
          res.json({ success: false, message: "jwt Expired" });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ error: err.message, success: false });
  }
};
module.exports = passwordResetOtpCheck;
