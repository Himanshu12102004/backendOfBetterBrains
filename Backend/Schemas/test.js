const mongoose = require("mongoose");

const userTests = new mongoose.Schema({
  courseName: { type: String },
  courseTests: {
    type: [
      {
        testName: { type: String },
        isSubmittedInTime: { type: Boolean },
        testResult: [
          {
            marksRewarded: { type: Number },
            optionsChosen: [
              { optionNo: { type: String }, isCorrect: { type: Boolean } },
            ],
            intAns: { ans: { type: String }, isCorrect: { type: Boolean } },
            timeTaken: { type: String },
          },
        ],
        physics: {
          correctQuestions: { type: Number },
          incorrectQuestions: { type: Number },
          unattemptedQuestions: { type: Number },
          totalMarks: { type: Number },
        },
        chemistry: {
          correctQuestions: { type: Number },
          incorrectQuestions: { type: Number },
          unattemptedQuestions: { type: Number },
          totalMarks: { type: Number },
        },
        maths: {
          correctQuestions: { type: Number },
          incorrectQuestions: { type: Number },
          unattemptedQuestions: { type: Number },
          totalMarks: { type: Number },
        },
        netMarks: { type: Number },
      },
    ],
  },
});
module.exports = userTests;
