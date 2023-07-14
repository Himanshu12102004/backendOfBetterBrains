const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const permanentModel = require("../Schemas/schema");
const resetPasswordModel = require("../Schemas/changePassword");
const { createToken } = require("../controllers/jwtCreation");
const setNewPassword = async (req, res) => {
  const myJwt = req.headers.authentication.split(" ")[1];

  // console.log(req.body);
  console.log(myJwt);
  const newPassword = req.body.newPassword;
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
          if (user && user.hasEnteredOtp) {
            let hashedPassword;
            if (newPassword.length < 6) {
              return res.json({
                success: false,
                message: "the password must be at least 6 characters long",
              });
            } else {
              const salt = await bcrypt.genSalt();
              hashedPassword = await bcrypt.hash(newPassword, salt);
            }
            await permanentModel.updateOne(
              { _id: user._id },
              { $set: { password: hashedPassword } }
            );
            await resetPasswordModel.deleteOne({ _id: user._id });
            res.json({ success: true });
          } else res.json({ error: "wrong otp", success: false });
        } catch (err) {
          res.json({ success: false, message: err.message });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ error: err.message, success: false });
  }
};
module.exports = setNewPassword;
