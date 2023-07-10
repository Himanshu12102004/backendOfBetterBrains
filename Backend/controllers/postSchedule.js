const mongoose = require("mongoose");
const model = require("../Schemas/scheduleSchema");
const postSchedule = async (req, res) => {
  console.log("hello he man is here");
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
};
module.exports = postSchedule;
