const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mongo = async () => {
  try {
    // mongoose.connect(mongoURI);

    const db = await mongoose.connect(
      "mongodb+srv://kartik:kartik%40123@cluster0.2iakz8l.mongodb.net/BetterBrains"
    );
    // console.log(db.Collection);
  } catch (e) {
    console.log(e);
  }
};
mongo();

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
const model = mongoose.model("schedule", schema);

const app = express();
app.use(cors());
app.listen(3003, () => {
  console.log("servers");
});
app.use(express.json());
app.post("/schedule", async (req, res) => {
  const {
    courseName,
    price,
    testName,
    day,
    startTime,
    endTime,
    physicsSyllabus,
    chemistrySyllabus,
    mathsSyllabus,
  } = req.body;
  console.log(req.body);
  console.log(req.body);
  try {
    const updated = await model.updateOne(
      { courseName: courseName },
      {
        $push: {
          schedule: {
            testName,
            day,
            startTime,
            endTime,
            physicsSyllabus,
            chemistrySyllabus,
            mathsSyllabus,
          },
        },
      }
    );
    if (updated.matchedCount === 0) {
      await model.create({
        price,
        courseName,
        schedule: {
          testName,
          day,
          startTime,
          endTime,
          physicsSyllabus,
          chemistrySyllabus,
          mathsSyllabus,
        },
      });
    }
    res.json({ success: true });
  } catch (e) {
    res.json({ success: e.message });
  }
});
