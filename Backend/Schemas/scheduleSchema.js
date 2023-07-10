const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  courseName: { type: String },
  price: { type: Number },
  schedule: [
    {
      testName: { type: String },
      day: {
        date: { type: Number },
        month: { type: Number },
        year: { type: Number },
      },
      startTime: {
        hour: { type: Number },
        minute: { type: Number },
      },
      endTime: {
        hour: { type: Number },
        minute: { type: Number },
      },
      physicsSyllabus: [String],
      chemistrySyllabus: [String],
      mathsSyllabus: [String],
    },
  ],
});
// module.exports = schema;
module.exports = mongoose.model("schedule", schema);
