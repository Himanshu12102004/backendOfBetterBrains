const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: String,
  questionPaper: [
    {
      subject: { type: String },
      question: { type: String },
      qDiag: { type: String },
      options: [String],
      ansOptions: [String],
      integerAns: { type: String },
      maximumMarks: { type: Number },
      partialMarks: { type: Boolean },
      negativeMarking: { type: Number },
      solnImg: { type: String },
      solnVid: { type: String },
      isMultipleChoice: { type: Boolean },
      subject: { type: String },
    },
  ],
});
module.exports = schema;
