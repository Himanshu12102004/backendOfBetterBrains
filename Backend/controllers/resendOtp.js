const jwt = require("jsonwebtoken");
const temporaryModel = require("../Schemas/temporaryUsers");
const smtp = require("./smtp");
const resendOtp = (req, res, next) => {
  console.log("hemanhhiahzis");
  // console.log(req.url);
  // console.log(req.headers);
  if (!req.headers.authentication) next();
  const token = req.headers.authentication.split(" ")[1];
  // console.log(req.headers);
  // console.log(token);
  if (token) {
    jwt.verify(
      token,
      process.env.EMAIL_VERIFICATION_SECRET,
      async (err, payload) => {
        if (err) {
          // console.log(err);
          res.status(400).json({ success: false });
        } else {
          // console.log("hi" + payload.id);
          try {
            let user = await temporaryModel.findById(payload.id);
            if (!user) {
              res.status(400).json({ success: false });
            }
            await temporaryModel.findByIdAndDelete(payload.id);
            const newDoc = await temporaryModel.create({
              email: user.email,
              password: user.password,
              phone: user.phone,
              name: user.name,
              createdAt: new Date(),
              _id: user._id,
            });
            smtp(newDoc._id, newDoc.email)
              .then((result) => {
                console.log(result);
              })
              .catch((e) => {
                console.log(e);
              });
            // console.log(user);
            res.json({ otp: "sent again" });
            next();
          } catch (err) {
            console.log(err);
          }
        }
      }
    );
  } else {
    res.status(400).json({ success: false });
  }
};
module.exports = resendOtp;
