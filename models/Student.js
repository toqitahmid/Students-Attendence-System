const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    roll: {
      type: String,
      required: true,
      unique: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Departments",
      required: true
    },
    semester: {
      type: Number,
      required: true
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Student', studentSchema);