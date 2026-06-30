const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
console.log("Student schema fields:", Object.keys(Student.schema.paths));
//CREATE
router.post("/", async (req, res) => {
//   console.log("Received body:", req.body);

  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL
router.get("/", async (req, res) => {
  try {
    const { departmentId, semester } = req.query;

    let filter = {};

    if (departmentId) {
      filter.departmentId = departmentId;
    }

    if (semester) {
      filter.semester = Number(semester);
    }

    const students = await Student.find(filter).populate("departmentId");

    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//READ single
router.get("/:id", async (req, res) => {
  try {
    const student = await Student
      .findById(req.params.id)
      .populate("departmentId");

    if (!student) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//UPDATE
router.patch("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
