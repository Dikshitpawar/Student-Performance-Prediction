const performanceModel = require("../models/studentPerformance.model");
const { exec } = require("child_process");
const path = require("path");







async function addStudentPerformance(req, res) {
    try {
        const student = req.student;
        const { attendance, internalMarks, assignmentMarks, studyHours, subject } = req.body;

        if (attendance == null || internalMarks == null || assignmentMarks == null || studyHours == null || subject== null) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        const pythonScriptPath = path.join(__dirname, "../../ai_model/predict.py");

const command = `py "${pythonScriptPath}" ${attendance} ${internalMarks} ${assignmentMarks} ${studyHours}`;

        exec(command, async (error, stdout, stderr) => {
            if (error) { 
                console.error("Python Error:", error);
                console.log("Stderr===>" , stderr)
                return res.status(500).json({ message: "AI prediction failed", success: false });
            }

            console.log("Stdout===>" , stdout) 
            const predictionResult = JSON.parse(stdout);


            // let predictionText = predictionResult === "1" ? "Good Performance" : "Needs Improvement";

            // let weakAreas = [];
            // let suggestions = [];

            // // Attendance check
            // if (attendance < 75) {
            //     weakAreas.push("Low Attendance");
            //     suggestions.push("Attend classes regularly to improve understanding.");
            // }

            // // Internal marks check
            // if (internalMarks < 40) {
            //     weakAreas.push("Low Internal Marks");
            //     suggestions.push("Revise daily and focus more on internal test preparation.");
            // }

            // // Assignment marks check
            // if (assignmentMarks < 40) {
            //     weakAreas.push("Poor Assignment Performance");
            //     suggestions.push("Complete assignments on time and practice more problems.");
            // }

            // // Study hours check
            // if (studyHours < 2) {
            //     weakAreas.push("Insufficient Study Hours");
            //     suggestions.push("Increase daily study hours for better performance.");
            // }


            const performanceData = await performanceModel.create({
    studentId: student._id,
    subject,
    attendance,
    internalMarks,
    assignmentMarks,
    studyHours,
    prediction: predictionResult.prediction,
    riskScore: predictionResult.riskScore,
    weakAreas: predictionResult.weakAreas,
    suggestions: predictionResult.suggestions
});


            return res.status(201).json({
                message: "Student performance added successfully",
                success: true,
                data: performanceData
            });
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}



async function getStudentPerformance(req, res) {
    try {
        const student = req.student;

        const performance = await performanceModel.find({ studentId: student._id });

        return res.status(200).json({
            message: "Student performance fetched successfully",
            success: true,
            data: performance
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}


async function getAllStudentPerformance(req, res) {
    try {
        const data = await performanceModel
            .find()
            .populate('studentId', 'name email');

        return res.status(200).json({
            message: "All students performance fetched successfully",
            success: true,
            data
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

async function deletePerformanceController(req, res) {
  try {
    const { id } = req.params;

    const performance = await performanceModel.findByIdAndDelete(id);

    if (!performance) {
      return res.status(404).json({
        success: false,
        message: "Performance not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Performance deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
}







module.exports = {
    addStudentPerformance,
    getStudentPerformance,
    getAllStudentPerformance,
    deletePerformanceController,
};
