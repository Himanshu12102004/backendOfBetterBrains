const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { type } = require("os");
const schema = new mongoose.Schema({
  name: String,
  questionPaper: [
    {
      question: {
        type: String,
      },
      qDiag: { type: String },
      options: [String],
      ansOptions: [String],
      integerAns: { type: String },
      solnImg: { type: String },
      solnVid: { type: String },
      positiveMarks: {},
    },
  ],
});
module.exports = schema;
