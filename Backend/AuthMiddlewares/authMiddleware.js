const jwt = require("jsonwebtoken");
const userSchema = require("../Schemas/schema");
const temporaryModel = require("../Schemas/temporaryUsers");
const freeRoutes = [
  "/signup",
  "/login",
  "/postschedule",
  "/otp",
  "/authorizeUser",
  "/resendOtp",
  // "/hello",
];
const requireAuth = (req, res, next) => {
  console.log("heman");

  // console.log(req.url);
  if (freeRoutes.includes(req.url)) {
    console.log("hello I am himanshu");
    return next();
  }
  if (!req.headers.authentication) next();
  const token = req.headers.authentication.split(" ")[1];
  const otpToken = req.headers.authentication.split(" ")[2];
  // console.log(req.headers);
  // console.log(token);
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, jwtDecoded) => {
        if (err) {
          res.status(400).json({ success: false, err: "user not verified" });
        } else {
          let user = await userSchema.findById(jwtDecoded.id);
          req.user = user;
          next();
        }
      }
    );
  } else if (otpToken) {
    jwt.verify(
      token,
      process.env.EMAIL_VERIFICATION_SECRET,
      async (err, jwtDecoded) => {
        if (err) {
          res
            .status(400)
            .json({ success: false, message: "email not verified" });
        } else {
          let user = await temporaryModel.findById(jwtDecoded.id);
          if (user) {
            res
              .status(400)
              .json({ success: false, message: "email not verified" });
          }
          next();
        }
      }
    );
  }
};
module.exports = requireAuth;
