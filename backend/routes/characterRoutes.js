const express = require("express");
const router = express.Router();

const characterManagement = require("./characters/characterManagement")
const characterStats = require("./characters/characterStats");
const characterSkills = require("./characters/characterSkills");

router.use("/", characterManagement);
router.use("/", characterStats);
router.use("/", characterSkills);

module.exports = router;
