const mongoose = require("mongoose");
const { isEmail } = require("validator");
const testSchema = require("./test");
const bcrypt = require("bcrypt");
const phoneValidator = (v) => {
  v = "" + v;
  // console.log(("" + v).length);
  if (v.length !== 10) {
    console.log("ywdfywfdw");
    return false;
  }
  for (let a of v) {
    if (a < "0" || a > "9") {
      console.log("himagssgy");
      return false;
    }
  }
  return true;
};
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is a required Field"],
  },
  email: {
    type: String,
    validate: [isEmail, "enter valid email"],
    required: [true, "email is required"],
  },
  phone: {
    type: Number,

    // length: [, "enter a valid phone no."],
    validate: [phoneValidator, "enter valid phone no."],
  },
  password: {
    type: String,
    minlength: [6, "minlength of password must be 6"],
  },
  testLive: [
    {
      course: { type: String },
      test: { type: String },
    },
  ],
  boughtCourses: [String],
  paymentDetails: [
    {
      name: { type: String },
      ref_id: { type: String },
      date: { type: Date },
    },
  ],
  testsGiven: [testSchema],
});

schema.statics.login_check = async function (email, password) {
  // console.log("himanshu", email, password);
  console.log("himanshu");
  const user = await this.findOne({ email });
  // console.log(user);
  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      return user;
    }
    throw Error("Wrong Password");
  }
  throw Error("Wrong email");
};
module.exports = mongoose.model("users", schema);
