const express = require("express");
const controller = require("../controllers/controllers");
const logSignRouter = express.Router();
const getTestsRouter = express.Router();
const getCoursesRouter = express.Router();
const adminRouter = express.Router();
const authorizationRouter = express.Router();
const resendOtpRouter = express.Router();
const getScheduleRouter = express.Router();
const getResultRouter = express.Router();

const authorizeUser = require("../controllers/authorization");
const getQuestionPaper = require("../controllers/getQuestionPaper");
const postSchedule = require("../controllers/postSchedule");
const getCourses = require("../controllers/getCourses");
const resendOtp = require("../controllers/resendOtp");
const getSchedule = require("../controllers/getSchedule");
const getResult = require("../controllers/submitAndCheck");
const postQuestions = require("../admin/controllers/postQuestions");
const hello = (req, res) => {
  req.hello = "hiomanshu";
};
logSignRouter.route("/signup").post(controller.signUpBeforeAuthentication);
logSignRouter.route("/login").post(controller.logIn);
getCoursesRouter.route("/myCourses").get(getCourses);
getTestsRouter.route("/test").get(getQuestionPaper);
adminRouter.route("/postschedule").post(postSchedule);
authorizationRouter.route("/authorizeUser").post(authorizeUser);
resendOtpRouter.route("/resendOtp").get(resendOtp);
getScheduleRouter.route("/schedule").get(getSchedule);
getResultRouter.route("/result").post(getResult);
adminRouter.route("/data").post(postQuestions);
module.exports = {
  logSignRouter,
  getTestsRouter,
  authorizationRouter,
  adminRouter,
  getCoursesRouter,
  resendOtpRouter,
  getScheduleRouter,
  getResultRouter,
};
