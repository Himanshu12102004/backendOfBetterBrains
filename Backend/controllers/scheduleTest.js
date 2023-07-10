const scheduleModel = require("../Schemas/scheduleSchema");
const users = require("../Schemas/schema");
const nodeCron = require("node-cron");
const schedulingFunction = async () => {
  const courseArray = await scheduleModel.find(
    {},
    { schedule: 1, courseName: 1 }
  );
  const schedule = [];
  console.log(courseArray);
  courseArray.forEach((course) => {
    course.schedule.forEach((test) => {
      const { day, startTime, endTime, testName } = test;
      schedule.push(
        new nodeCron.schedule(
          `${startTime.minute} ${startTime.hour} ${day.date} ${day.month} *`,
          async () => {
            console.log(users);
            const a = await users.updateMany(
              { boughtCourses: `${course.courseName}` },
              {
                $push: {
                  testLive: { course: course.courseName, test: testName },
                },
              }
            );
            console.log(a);
          }
        )
      );
      schedule.push(
        new nodeCron.schedule(
          `${endTime.minute} ${endTime.hour} ${day.date} ${day.month} *`,
          async () => {
            console.log(users);
            const a = await users.updateMany(
              { boughtCourses: `${course.courseName}` },
              {
                $pull: {
                  testLive: { course: course.courseName, test: testName },
                },
              }
            );
            console.log(a);
          }
        )
      );
    });
  });
};
module.exports = schedulingFunction;
