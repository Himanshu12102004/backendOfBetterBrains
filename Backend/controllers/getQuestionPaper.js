const qpSchema = require("../admin/schema/testSchema");
const mongoose = require("mongoose");
const getQp = async (req, res) => {
  const { course, test } = req.query;
  // console.log(course, test);
  // console.log(req.user);

  const boughtCourses = req.user.boughtCourses;
  // console.log(req.user.testLive);
  const isTestLive = () => {
    const liveTests = req.user.testLive;
    if (!liveTests) {
      return false;
    }
    for (let i = 0; i < liveTests.length; i++)
      if (liveTests[i].course === course && liveTests[i].test === test) {
        // console.log("fuck u");
        return true;
      }
    return false;
  };
  if (boughtCourses.includes(course)) {
    // console.log("is test libe= " + isTestLive());
    if (isTestLive()) {
      const myCourse = mongoose.model(course, qpSchema);

      let crudeQp = await myCourse.findOne({ name: test });
      if (!crudeQp)
        return res.json({ success: false, message: "no such test" });
      crudeQp = crudeQp.questionPaper;
      // console.log(crudeQp);
      const fineQp = [];
      crudeQp = [...crudeQp];
      console.log(crudeQp[0].maximumMarks);
      crudeQp.forEach((elem) => {
        // console.log(elem);
        const p = elem;
        // console.log(p);
        // console.log(elem.partialMarks);
        const {
          question,
          qDiag,
          options,
          maximumMarks,
          negativeMarking,
          partialMarks,
          isMultipleChoice,
          ansOptions,
          integerAns,
          subject,
        } = elem;
        console.log(p["question"], p["partialMarks"]);
        // console.log(p);
        console.log(
          question,
          qDiag,
          options,
          maximumMarks,
          negativeMarking,
          partialMarks,
          isMultipleChoice,
          ansOptions,
          integerAns
        );
        console.log(elem.maximumMarks);
        const finalQuestion = {
          question,
          qDiag,
          options,
          maximumMarks,
          negativeMarking,
          partialMarks,
          isMultipleChoice,
          subject,
        };
        fineQp.push(finalQuestion);
      });
      res.json({ success: true, name: test, questionPaper: fineQp });
    } else res.json({ success: false, message: "testnotlive" });
  } else res.json({ success: false, message: "buy the course first" });
};
module.exports = getQp;

// Tests
