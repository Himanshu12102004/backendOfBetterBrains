const temporaryModel = require("../Schemas/temporaryUsers");
const jwt = require("jsonwebtoken");
const model = require("../Schemas/schema");
const smtp = require("./smtp");

const { createToken } = require("./jwtCreation");
// console.log(createToken);
const handleError = (e) => {
  // console.log(e);
  const error = { email: "", password: "", phone: "" };
  // console.log(e.code)

  // console.log(e);
  if (e.message === "DuplicateEmail") {
    error.email = "User Already Exists with this email";
  }
  if (e.message === "DuplicatePhone") {
    error.phone = "User Already Exists with this phone";
  }

  if (e.message.includes("users validation failed")) {
    // console.log(e);
    Object.values(e.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }
  return error;
};

module.exports.signUpBeforeAuthentication = async (req, res) => {
  const { email, password, phone, name } = req.body;
  // console.log(req.body);
  try {
    if (
      (await model.findOne({ email })) ||
      (await temporaryModel.findOne({ email }))
    ) {
      throw new Error("DuplicateEmail");
    }
    if (
      (await model.findOne({ phone })) ||
      (await temporaryModel.findOne({ phone }))
    ) {
      throw new Error("DuplicatePhone");
    }

    const user = await temporaryModel.create({
      email,
      password,
      phone,
      name,
      createdAt: new Date(),
    });

    smtp(user._id, email)
      .then((result) => {
        console.log(result);
      })
      .catch((e) => {
        console.log(e);
      });
    const userForOtp = { email, password, phone, name };
    const jwt = require("jsonwebtoken");
    const maxAge = 3 * 24 * 60 * 60;
    module.exports.createToken = (id) => {
      return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: maxAge,
      });
    };

    const otpJwt = () => {
      return jwt.sign({ id: user._id }, process.env.EMAIL_VERIFICATION_SECRET, {
        expiresIn: "3m",
      });
    };
    const otpToken = otpJwt();
    console.log(otpToken);
    res.status(201).json({ user, success: true, otpToken });
  } catch (e) {
    console.log(e.message);

    const error = handleError(e);

    res.status(400).json({
      error,
    });
  }
};
module.exports.logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const User = await model.login_check(email, password);

    // JWT tokens
    const token = createToken(User._id);
    // res.cookie("jwt", token, {
    //   httpOnly: true,
    //   maxAge: maxAge * 1000,
    //   path: "http://127.0.0.1:5500/Frontend",
    //   domain: "127.0.0.1",
    // });
    res.status(200).json({ User, token, success: true });
  } catch (e) {
    const errors = handleError(e);
    res.status(400).json({ errors, success: false });
  }
};
