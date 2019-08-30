const express = require("express");
const router = express.Router();

const caContext = require("../data/ca");
const miContext = require("../data/mi");
const certContext = require("../data/cert");
/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", certContext);
});

module.exports = router;
