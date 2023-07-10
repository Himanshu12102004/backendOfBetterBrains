const scheduleSchema = require("../Schemas/scheduleSchema");

const getSchedule = async (req, res) => {
  console.log("ttghgkj");
  const course = req.query.course;
  const hasCourse = req.user.boughtCourses.includes(course);
  if (hasCourse) {
    const allTests = req.user.testsGiven;
    const theTest = allTests.filter((elem) => {
      return elem.courseName === course;
    });
    res.json({
      name: req.user.name,
      testLive: req.user.testLive,
      success: true,
      schedule: await scheduleSchema.findOne({ courseName: course }),
      courseTests: theTest,
    });
  }
};
module.exports = getSchedule;
