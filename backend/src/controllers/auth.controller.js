const studentModel = require("../models/auth.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function registerController(req,res){
    try {

    const {name,email,password,enrollmentNo,department,semester,mobile} = req.body;

    if(!name || !email || !password || !enrollmentNo || !department || !semester || !mobile){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }

    /* ===== CHECK EMAIL ===== */
    const emailExist = await studentModel.findOne({email})
    if(emailExist){
        return res.status(400).json({
            success:false,
            message:"Email already registered"
        })
    }

    /* ===== CHECK ENROLLMENT ===== */
    const enrollExist = await studentModel.findOne({enrollmentNo})
    if(enrollExist){
        return res.status(400).json({
            success:false,
            message:"Enrollment already registered"
        })
    }

    const hashPassword = await bcrypt.hash(password,10)

    const student = await studentModel.create({
        name,
        email,
        password:hashPassword,
        enrollmentNo,
        department,
        semester:Number(semester),
        mobile
    })

    const token = jwt.sign(
        {id:student._id},
        process.env.JWT_SECRET,
        {expiresIn:"1h"}
    )

    res.cookie("token",token)

    return res.status(201).json({
        success:true,
        message:"Registered Successfully",
        data:student,
        token
    })

} catch(error){

    return res.status(500).json({
        success:false,
        message:"Server Error"
    })

}
}


async function loginController(req, res) {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json(
            { 
                message: "All fields are required" ,
                success : false
            }
        );
    }

    const student = await studentModel.findOne({email});

    if(!student) {  
        return res.status(400).json(
            { 
                message: "Invalid credentials" ,
                success : false
            }
        );
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);

    if(!isPasswordValid) {
        return res.status(400).json(
            { 
                message: "Invalid credentials" ,
                success : false
            }
        );
    }   

    const token = jwt.sign(
        {
            id: student._id,
        },
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    );

res.cookie("token", token, {
  httpOnly: true,
  secure: false,     
  sameSite: "lax"     
});
    return res.status(200).json(
        {
            message: "Login successful",
            success: true,
            data:student,
            token
        }
    );
}


async function logoutController(req, res) {
    res.clearCookie('token');
    return res.status(200).json(    
        {
            message: "Logout successful",
            success: true
        }
    );
}



const updateProfileController = async(req,res)=>{
  try {

    const id = req.student._id;

    const {
      name,
      email,
      password,
      mobile,
      department,
      semester
    } = req.body;

    let updateData = {};

    if(name) updateData.name = name;
    if(email) updateData.email = email;
    if(mobile) updateData.mobile = mobile;
    if(department) updateData.department = department;
    if(semester) updateData.semester = Number(semester);

    // 👉 PASSWORD ONLY IF ENTERED
    if(password && password.trim() !== ""){
      const hashedPassword = await bcrypt.hash(password , 10);
      updateData.password = hashedPassword;
    }

    const updatedStudent = await studentModel.findByIdAndUpdate(
      id,
      {$set:updateData},
      {new:true , runValidators:true}
    ).select("-password");

    res.status(200).json({
      success:true,
      student:updatedStudent
    })

  } catch (error) {

    console.log("UPDATE ERROR => ",error);  // 👈 VERY IMPORTANT

    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}







module.exports = {registerController , loginController , logoutController , updateProfileController}; 