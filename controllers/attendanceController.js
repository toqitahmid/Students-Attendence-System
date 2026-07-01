const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

// 1. Create/Mark Attendance
exports.createAttendance = async (req, res) => {
  try {
    const { date, departmentId, semester, students } = req.body;

    if (
      !date ||
      !departmentId ||
      !semester ||
      !students ||
      students.length === 0
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const incomingStudent = students[0];

    // ✅ FIX: Added semester to ensure lookups find the EXACT class container group
    let attendance = await Attendance.findOne({ date, departmentId, semester });

    if (attendance) {
      const studentIndex = attendance.students.findIndex(
        (s) =>
          (s.studentId || s.student || "").toString() ===
          incomingStudent.studentId.toString(),
      );

      if (studentIndex > -1) {
        attendance.students[studentIndex].status = incomingStudent.status;
      } else {
        attendance.students.push(incomingStudent);
      }

      await attendance.save();
    } else {
      // Create a brand new sheet container row
      attendance = new Attendance({
        date,
        departmentId,
        semester,
        students,
      });
      await attendance.save();
    }

    // ✅ FIX: Instead of returning the raw sheet document object, return the standardized
    // single row item so the Admin frontend maps state changes flawlessly
    res.status(200).json({
      _id: attendance._id,
      student: incomingStudent.studentId,
      status: incomingStudent.status,
      date: attendance.date,
      semester: attendance.semester,
      department: attendance.departmentId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get Attendance
exports.getAttendance = async (req, res) => {
  try {
    const { date, departmentId, semester } = req.query;

    if (!date || !departmentId || !semester) {
      return res.status(400).json({
        message:
          "Date, departmentId, and semester are required query parameters.",
      });
    }

    // ✅ FIX: Query strictly includes semester filter logic matching frontend routes
    const attendanceSheet = await Attendance.findOne({
      date,
      departmentId,
      semester,
    });

    if (!attendanceSheet) {
      return res.status(200).json([]);
    }

    const formattedRecords = attendanceSheet.students.map((rec) => {
      const finalStudentId = rec.studentId || rec.student;

      return {
        _id: attendanceSheet._id,
        student: finalStudentId ? finalStudentId.toString() : "",
        status: rec.status,
        date: attendanceSheet.date,
        semester: attendanceSheet.semester,
        department: attendanceSheet.departmentId,
      };
    });

    res.status(200).json(formattedRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Update Attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, status } = req.body;

    const attendanceSheet = await Attendance.findById(id);
    if (!attendanceSheet) {
      return res
        .status(404)
        .json({ message: "Attendance sheet record not found" });
    }

    const studentRecord = attendanceSheet.students.find(
      (s) =>
        (s.studentId || s.student || "").toString() === studentId.toString(),
    );

    if (studentRecord) {
      studentRecord.status = status;
    } else {
      attendanceSheet.students.push({ studentId, status });
    }

    await attendanceSheet.save();

    res.status(200).json({
      _id: attendanceSheet._id,
      student: studentId,
      status: status,
      date: attendanceSheet.date,
      semester: attendanceSheet.semester,
      department: attendanceSheet.departmentId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSingleAttendance = async (req, res) => {};
exports.deleteAttendance = async (req, res) => {};
