const mongoose = require('mongoose');


const performanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    attendance: {
        type: Number,
        required: true
    },
    internalMarks: {
        type: Number,
        required: true  
    },
    assignmentMarks: {
        type: Number,
        required: true
    },
    studyHours: {
        type: Number,
        required: true
    },
    prediction: {
        type: String,
    },
    riskScore:{
   type:Number
},
    reason: {
    type: String
},
weakAreas: {
    type: [String]
},
suggestions: {
    type: [String]
}
} , { timestamps: true });

const performanceModel = mongoose.model('performance', performanceSchema);

module.exports = performanceModel;