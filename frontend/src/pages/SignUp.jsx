import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../styles/Auth.css";
import { useContext } from "react";
import { authContext } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import axios from "axios";

const Signup = () => {

  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const { url, setToken, setStudent } = useContext(authContext);

  const submitHandler = async (data) => {
    try {
      console.log(data)
      const response = await axios.post(`${url}/api/auth/register`, data);

      if (response.data.success) {

        const token = response.data.token;
        const student = response.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("student", JSON.stringify(student));

        setToken(token);
        setStudent(JSON.stringify(student));

        toast.success("Registered successfully!");
        navigate('/');
      }

    } catch (error) {
      console.error("Signup Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    reset();
  };

  return (
    <div className="auth-wrapper">
      <div className="sign-up-card">
        <div className="icon">🎓</div>

        <h2>Create Account</h2>
        <p className="subtitle">Student Registration</p>

        <form onSubmit={handleSubmit(submitHandler)}>

  <div className="form-grid">

    <div className="form-group">
      <label>Full Name</label>
      <input type="text" placeholder="Enter full name" {...register("name")} />
    </div>

    <div className="form-group">
      <label>Email</label>
      <input type="email" placeholder="Enter email" {...register("email")} />
    </div>

    <div className="form-group">
      <label>Password</label>
      <input type="password" placeholder="Enter password" {...register("password")} />
    </div>

    <div className="form-group">
      <label>Enrollment</label>
      <input type="text" placeholder="Enter enrollment no" {...register("enrollmentNo")} />
    </div>

    <div className="form-group">
      <label>Mobile</label>
      <input type="text" placeholder="Enter mobile no" {...register("mobile")} />
    </div>

    <div className="form-group">
      <label>Department</label>
      <select {...register("department")}>
        <option value="">Select Dept</option>
        <option value="CE">CE</option>
        <option value="IT">IT</option>
        <option value="ME">ME</option>
      </select>
    </div>

    <div className="form-group">
      <label>Semester</label>
      <select {...register("semester")}>
        <option value="">Select Sem</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
      </select>
    </div>

  </div>

  <button className="btn-primary full">Sign Up</button>
</form>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={() => navigate('/login')}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Signup;
