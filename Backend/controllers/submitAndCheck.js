const testSchema = require("../admin/schema/testSchema");
const mongoose = require("mongoose");
const userModel = require("../Schemas/schema");
const submitAndCheck = async (req, res) => {
  // console.log(req);
  console.log(req.query);
  const course = req.query.course;
  const answers = req.body.answers;
  const test = req.query.test;
  let i = 0;
  const qpModel = mongoose.model(course, testSchema);
  const qp = await qpModel.findOne({ name: test });
  let netMarks = 0;
  let questionNo = 0;
  let testResult = [];
  let physics = {
    correctQuestions: 0,
    incorrectQuestions: 0,
    unattemptedQuestions: 0,
    totalMarks: 0,
  };
  let chemistry = {
    correctQuestions: 0,
    incorrectQuestions: 0,
    unattemptedQuestions: 0,
    totalMarks: 0,
  };
  let maths = {
    correctQuestions: 0,
    incorrectQuestions: 0,
    unattemptedQuestions: 0,
    totalMarks: 0,
  };
  qp.questionPaper.forEach((elem) => {
    let subject = elem.subject;
    let marksForThisQuestion = 0;
    let resultOfTheQuestion = {
      optionsChosen: [],
      marksRewarded: 0,
      intAns: { ans: "", isCorrect: false },
      timeTaken: "",
    };
    if (answers[questionNo][0] === "") {
      testResult.push(resultOfTheQuestion);
      questionNo++;
      return;
    }
    if (elem.isMultipleChoice) {
      console.log("multipleChoice");
      let correctAns = 0;
      let negative = 0;
      if (elem.partialMarks) {
        console.log("partialMarks");
        console.log(elem);
        const noOfCorrectAnswers = elem.ansOptions.length;
        const marksPerAns = elem.maximumMarks / noOfCorrectAnswers;
        let flag = 0;
        for (let i = 0; i < answers[questionNo].length; i++) {
          let optionObject = {
            optionNo: "",
            isCorrect: false,
          };
          optionObject.optionNo = answers[questionNo][i];
          if (elem.ansOptions.includes(answers[questionNo][i])) {
            if (flag === 0) correctAns += 1;
            optionObject.optionNo = answers[questionNo][i];
            optionObject.isCorrect = true;
          } else {
            correctAns = 0;
            negative = elem.negativeMarking;
            flag = 1;

            optionObject.optionNo = answers[questionNo][i];
            optionObject.isCorrect = false;
          }
          resultOfTheQuestion.optionsChosen.push(optionObject);
        }

        marksForThisQuestion = correctAns * marksPerAns - negative;
        if (flag === 1) {
          if (subject === "physics") {
            physics.incorrectQuestions += 1;
            physics.totalMarks = marksForThisQuestion;
          }
          if (subject === "chemistry") {
            chemistry.incorrectQuestions += 1;
            chemistry.totalMarks = marksForThisQuestion;
          }
          if (subject === "maths") {
            maths.incorrectQuestions += 1;
            maths.totalMarks = marksForThisQuestion;
          }
        } else {
          if (subject === "physics") {
            physics.correctQuestions += 1;
            physics.totalMarks = marksForThisQuestion;
          }
          if (subject === "chemistry") {
            chemistry.correctQuestions += 1;
            chemistry.totalMarks = marksForThisQuestion;
          }
          if (subject === "maths") {
            maths.correctQuestions += 1;
            maths.totalMarks = marksForThisQuestion;
          }
        }
        netMarks += marksForThisQuestion;

        resultOfTheQuestion.marksRewarded = marksForThisQuestion;
        netMarks = Math.round(netMarks);
      } else {
        let noOfCorrectOptions = 0;
        for (let i = 0; i < answers[questionNo].length; i++) {
          let optionObject = {
            optionNo: "",
            isCorrect: false,
          };

          if (elem.ansOptions.includes(answers[questionNo][i])) {
            {
              noOfCorrectOptions += 1;
              optionObject.optionNo = answers[questionNo][i];
              optionObject.isCorrect = true;
            }
          } else {
            optionObject.optionNo = answers[questionNo][i];
            optionObject.isCorrect = false;
          }
        }
        if (
          noOfCorrectOptions === elem.ansOptions.length &&
          noOfCorrectOptions === answers[questionNo].length
        ) {
          marksForThisQuestion = elem.maximumMarks;
          netMarks += marksForThisQuestion;
          resultOfTheQuestion.marksRewarded = marksForThisQuestion;
          if (subject === "physics") {
            physics.correctQuestions += 1;
            physics.totalMarks = marksForThisQuestion;
          }
          if (subject === "chemistry") {
            chemistry.correctQuestions += 1;
            chemistry.totalMarks = marksForThisQuestion;
          }
          if (subject === "maths") {
            maths.correctQuestions += 1;
            maths.totalMarks = marksForThisQuestion;
          }
        } else {
          marksForThisQuestion = -elem.negativeMarking;
          netMarks += marksForThisQuestion;
          resultOfTheQuestion.marksRewarded = marksForThisQuestion;
          if (subject === "physics") {
            physics.incorrectQuestions += 1;
            physics.totalMarks = marksForThisQuestion;
          }
          if (subject === "chemistry") {
            chemistry.incorrectQuestions += 1;
            chemistry.totalMarks = marksForThisQuestion;
          }
          if (subject === "maths") {
            maths.incorrectQuestions += 1;
            maths.totalMarks = marksForThisQuestion;
          }
        }
      }
    } else if (elem.integerAns != "n/a") {
      if (answers[questionNo][0] === elem.integerAns) {
        marksForThisQuestion = elem.maximumMarks;
        netMarks += elem.maximumMarks;
        resultOfTheQuestion.intAns.ans = answers[questionNo][0];
        resultOfTheQuestion.marksRewarded = elem.maximumMarks;
        resultOfTheQuestion.intAns.isCorrect = true;
        if (subject === "physics") {
          physics.correctQuestions += 1;
          physics.totalMarks = marksForThisQuestion;
        }
        if (subject === "chemistry") {
          chemistry.correctQuestions += 1;
          chemistry.totalMarks = marksForThisQuestion;
        }
        if (subject === "maths") {
          maths.correctQuestions += 1;
          maths.totalMarks = marksForThisQuestion;
        }
      } else {
        marksForThisQuestion = -elem.negativeMarking;
        netMarks -= elem.negativeMarking;
        resultOfTheQuestion.marksRewarded = -elem.negativeMarking;

        resultOfTheQuestion.intAns.ans = answers[questionNo][0];
        resultOfTheQuestion.intAns.isCorrect = false;
        if (subject === "physics") {
          physics.incorrectQuestions += 1;
          physics.totalMarks = marksForThisQuestion;
        }
        if (subject === "chemistry") {
          chemistry.incorrectQuestions += 1;
          chemistry.totalMarks = marksForThisQuestion;
        }
        if (subject === "maths") {
          maths.incorrectQuestions += 1;
          maths.totalMarks = marksForThisQuestion;
        }
      }
    } else {
      if (answers[questionNo][0] === elem.ansOptions[0]) {
        netMarks += elem.maximumMarks;
        marksForThisQuestion = elem.maximumMarks;
        resultOfTheQuestion.marksRewarded = elem.maximumMarks;
        if (subject === "physics") {
          physics.correctQuestions += 1;
          physics.totalMarks = marksForThisQuestion;
        }
        if (subject === "chemistry") {
          chemistry.correctQuestions += 1;
          chemistry.totalMarks = marksForThisQuestion;
        }
        if (subject === "maths") {
          maths.correctQuestions += 1;
          maths.totalMarks = marksForThisQuestion;
        }
        resultOfTheQuestion.optionsChosen.push({
          optionNo: answers[questionNo][0],
          isCorrect: true,
        });
      } else {
        marksForThisQuestion = elem.maximumMarks;
        netMarks -= elem.negativeMarking;
        resultOfTheQuestion.marksRewarded = -elem.negativeMarking;
        if (subject === "physics") {
          physics.incorrectQuestions += 1;
          physics.totalMarks = marksForThisQuestion;
        }
        if (subject === "chemistry") {
          chemistry.incorrectQuestions += 1;
          chemistry.totalMarks = marksForThisQuestion;
        }
        if (subject === "maths") {
          maths.incorrectQuestions += 1;
          maths.totalMarks = marksForThisQuestion;
        }
        resultOfTheQuestion.optionsChosen.push({
          optionNo: answers[questionNo][0],
          isCorrect: false,
        });
      }
    }
    questionNo++;
    testResult.push(resultOfTheQuestion);
  });
  let a;
  // console.log(testResult);
  // console.log(physics, chemistry, maths);
  let found = false;
  req.user.testsGiven.forEach(async (elem) => {
    if (elem.courseName === course) {
      found = true;
    }
  });

  if (found === true) {
    console.log("dvd");
    a = await userModel.updateOne(
      { _id: req.user._id, "testsGiven.courseName": course },
      {
        $push: {
          "testsGiven.$.courseTests": {
            testName: test,
            isSubmittedInTime: true,
            testResult,
            physics,
            chemistry,
            maths,
            netMarks,
          },
        },
      }
    );
  } else {
    console.log(
      "grigjrijgrigjrig",
      await userModel.updateOne(
        { _id: req.user._id },
        {
          $push: {
            testsGiven: {
              courseName: course,

              courseTests: [
                {
                  testName: test,
                  isSubmittedInTime: true,
                  testResult,
                  physics,
                  chemistry,
                  maths,
                  netMarks,
                },
              ],
            },
          },
        }
      )
    );
  }
  testResult.forEach((elem) => {
    console.log(elem.optionsChosen);
  });
  console.log(netMarks);
  // console.log(a);

  const user = await userModel.findOne({
    _id: req.user._id,
  });
  const courseTest = user.testsGiven.filter((elem) => {
    return elem.courseName === course;
  });
  const [myTests] = courseTest;
  const myPresentTest = myTests.courseTests.filter((elem) => {
    return elem.testName === test;
  });
  res.json({ yourmarks: netMarks, yourTest: myPresentTest });
};
module.exports = submitAndCheck;
