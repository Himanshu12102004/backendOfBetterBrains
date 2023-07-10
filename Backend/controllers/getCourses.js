const getCourses = (req, res, next) => {
  console.log(req.user);
  console.log(req.url);
  res.json({
    name: req.user.name,
    boughtCourses: req.user.boughtCourses,
    testLive: req.user.testLive,
  });
};
module.exports = getCourses;
