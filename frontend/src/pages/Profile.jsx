import React, { useContext, useState } from "react";
import "../styles/Profile.css";
import { authContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, BookOpen, Calendar } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {

  const { student , setStudent , setToken , url } = useContext(authContext);
  const navigate = useNavigate();
  const [editMode , setEditMode] = useState(false);

  const user = JSON.parse(student);

  /* ================= FORM STATE ================= */

  const [formData , setFormData] = useState({
    name:user.name,
    email:user.email,
    password:"",
    mobile:user.mobile,
    department:user.department,
    semester:user.semester
  });

  /* ================= INITIALS ================= */

  const getInitials = (name)=>{
    if(!name) return "";
    const words = name.split(" ");
    if(words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    })
  }

  /* ================= UPDATE PROFILE ================= */

  const handleSave = async()=>{

    try {

      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${url}/api/auth/update-profile`,
        formData,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      toast.success("Profile Updated Successfully");

      localStorage.setItem("student",JSON.stringify(res.data.student));
      setStudent(JSON.stringify(res.data.student));
      setEditMode(false);

     } catch (error) {
  toast.error(error.response?.data?.message || "Update Failed");
}

  }

  /* ================= LOGOUT ================= */

  const handleLogout = ()=>{
    localStorage.clear();
    setStudent(null);
    setToken(null);
    navigate("/login");
  }

  return (
    <div className="profile-container">

      <div className="profile-cover"></div>

      <div className="profile-header">

        <div className="profile-avatar">
          <span>{getInitials(formData.name)}</span>
        </div>

        <div className="profile-details">
          <h2>{formData.name}</h2>
          <p>{user.enrollmentNo} | {formData.department} | Sem {formData.semester}</p>

          <div className="profile-btns">
            <button className="back-btn" onClick={()=>navigate("/")}>
              Back to Home
            </button>

            <button className="edit-btn" onClick={()=>setEditMode(!editMode)}>
              {editMode ? "Cancel" : "Edit Profile"}
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ================= PERSONAL INFO ================= */}

      <div className="info-card">

        <div className="info-header">
          <h3>Personal Information</h3>
        </div>

        <div className="info-grid">

          <div className="info-box">
            <User/>
            <input
              name="name"
              disabled={!editMode}
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="info-box">
            <Mail/>
            <input
              name="email"
              disabled={!editMode}
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="info-box">
            <Phone/>
            <input
              name="mobile"
              disabled={!editMode}
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          <div className="info-box">
            <BookOpen/>
            <input
              name="department"
              disabled={!editMode}
              value={formData.department}
              onChange={handleChange}
            />
          </div>

          <div className="info-box">
            <Calendar/>
            <input
              type="number"
              name="semester"
              disabled={!editMode}
              value={formData.semester}
              onChange={handleChange}
            />
          </div>

          <div className="info-box">
            🔒
            <input
              type="password"
              name="password"
              disabled={!editMode}
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

        </div>

        {editMode &&
        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>}

      </div>

    </div>
  );
};

export default Profile;
