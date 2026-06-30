const Attendance = require("../models/Attendance");

exports.createAttendance = async(req, res) => {
    console.log("Method:", req.method);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    try{
        const {date, departmentId, semester, students} = req.body;
        for (const student of students) {
          const foundStudent = await Student.findById(student.studentId);

          if (!foundStudent) {
            return res.status(404).json({
              message: "Student not found",
            });
          }
        }
        if(!date || !departmentId || !semester || !students || students.length === 0){
            
            return res.status(400).json({
                message: 'All fields are required'
            })
        }
        const existingAttendance = await Attendance.findOne({
          date,
          departmentId,
          semester,
        });
        if (existingAttendance) {
          return res.status(400).json({
            message: "Attendance already taken.",
          });
        }

        const attendance = new Attendance({
          date,
          departmentId,
          semester,
          students,
        });
        await attendance.save();
        res.status(201).json(attendance)
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}
exports.getAttendance = async(req, res) => {}
exports.getSingleAttendance = async(req, res) => {}
exports.updateAttendance = async(req, res) => {}
exports.deleteAttendance = async(req, res) => {}