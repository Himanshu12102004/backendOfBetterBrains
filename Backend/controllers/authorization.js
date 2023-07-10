const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const temporaryModel = require("../Schemas/temporaryUsers");
const permanentModel = require("../Schemas/schema");
const temporaryUsers = require("../Schemas/temporaryUsers");
const { createToken } = require("../controllers/jwtCreation");
const authorizeUser = async (req, res) => {
  const myJwt = req.headers.authentication.split(" ")[1];
  const token = req.body.otp;
  console.log(req.body);
  console.log(token);
  console.log(req.headers);
  try {
    jwt.verify(
      myJwt,
      process.env.EMAIL_VERIFICATION_SECRET,
      async (err, jwtDecoded) => {
        try {
          console.log(jwtDecoded);

          let user = await temporaryModel.findById(jwtDecoded.id);
          console.log(user);
          console.log(jwtDecoded);
          if (user && (await bcrypt.compare(token, user.otp))) {
            await temporaryModel.findByIdAndDelete(jwtDecoded.id);
            const { email, password, phone, name } = user;
            const permanentUser = await permanentModel.create({
              email,
              phone,
              password,
              name,
            });
            res.json({ success: true, token: createToken(permanentUser._id) });
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
module.exports = authorizeUser;
