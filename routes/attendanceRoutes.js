const express = require("express");
const router = express.Router();

const {
  createAttendance,
  getAttendance,
  getSingleAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

router.post("/", createAttendance);

router.get("/", getAttendance);

router.get("/:id", getSingleAttendance);

router.patch("/:id", updateAttendance);

router.delete("/:id", deleteAttendance);

module.exports = router;