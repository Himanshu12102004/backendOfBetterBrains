const express = require("express");
const scheduleTests = require("./controllers/scheduleTest");
const mongoose = require("mongoose");
require("dotenv").config();
console.log(process.env.PORT);
const router = require("./Routes/routes");
const cookieParser = require("cookie-parser");
const cookie_session = require("cookie-session");
require("./config/passportConfig");
const passport = require("passport");

// const hasCourses = require("./AuthMiddlewares/authMiddleware");
const cors = require("cors");
const requireAuth = require("./AuthMiddlewares/authMiddleware");
// mongoURI = "mongodb://localhost:27017/education";

const mongo = async () => {
  try {
    // mongoose.connect(mongoURI);

    const db = await mongoose.connect(process.env.MONGO_URI);
    scheduleTests();
    // console.log(db.Collection);
  } catch (e) {
    console.log(e);
  }
};
mongo();

const app = express();
app.use(cors());
app.set("view engine", "ejs");
app.use(express.json());
app.use(
  cookie_session({ maxAge: 24 * 60 * 60 * 1000, keys: ["duhudhuhuvdsgr"] })
);

app.use(passport.initialize());

app.use(passport.session());
app.use(cookieParser());
app.use(router.adminRouter);
app.use("/auth", router.googleRouter);

app.use(requireAuth);
app.listen(process.env.PORT || 5000, () => {
  console.log("server");
});
app.use(router.logSignRouter);
app.use(router.getTestsRouter);
app.use(router.adminRouter);
app.use(router.getCoursesRouter);
app.use(router.authorizationRouter);
app.use(router.resendOtpRouter);
app.use(router.getScheduleRouter);
app.use(router.getResultRouter);
app.post("/data", async (req, res) => {
  const { question, answer, options } = req.body;
  const a = await TestSchema.create({ question, answer, options });
  console.log(a);
  if (a) res.json({ success: true });
  else {
    res.json({ success: false });
  }
});
// app.get("/test", (req, res) => {
//   console.log(req.query);
// });

// -------------------------------MIDDLEWARE FOR EXAM ROUTES------------------
// app.use("/prarambh1", requireAuth, check);
