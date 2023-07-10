const mongoose = require("mongoose");
const testSchema = require("../schema/testSchema");
const postQuestions = async (req, res) => {
  let {
    course,
    question,
    options,
    qDiag,
    ansOptions,
    integerAns,
    name,
    solnImg,
    solnVid,
    maxMarks,
    negative,
    partial,
    isMultipleChoice,
  } = req.body;
  const model = mongoose.model(course, testSchema);
  console.log(isMultipleChoice);
  if (isMultipleChoice == 1) isMultipleChoice = true;
  else isMultipleChoice = false;
  if (partial == 1) partial = true;
  else partial = false;
  try {
    const QuestionPaper = await model.updateOne(
      { name: name },
      {
        $push: {
          questionPaper: {
            question,
            options,
            qDiag,
            ansOptions,
            integerAns,
            solnImg,
            solnVid,
            maximumMarks: maxMarks,
            negativeMarking: negative,
            partialMarks: partial,
            isMultipleChoice,
          },
        },
      }
    );
    if (QuestionPaper.matchedCount == 0) {
      const a = await model.create({
        questionPaper: [
          {
            question,
            options,
            qDiag,
            ansOptions,
            integerAns,
            solnImg,
            solnVid,
            maximumMarks: maxMarks,
            negativeMarking: negative,
            partialMarks: partial,
            isMultipleChoice,
          },
        ],
        name,
      });
      console.log(a);
    }
    res.json({ success: true });
  } catch (e) {
    console.log("Rfr" + e);
    res.json({ errors: e });
  }
};
module.exports = postQuestions;
