// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Signup from "./pages/SignUp";
// import Predict from "./pages/Predict";
// import History from "./pages/History";
// import Profile from "./pages/Profile";
// import { AuthProvider } from "./contexts/AuthContext";
// import { Toaster } from 'react-hot-toast';

// const App = () => {
//   return (
//     <>
//     <Toaster
//   position="top-center"
//   reverseOrder={false}
// />
//     <AuthProvider>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/predict" element={<Predict />} />
//         <Route path="/history" element={<History />} />
//         <Route path="/profile" element={<Profile />} />

//       </Routes>
//     </AuthProvider>
//     </>
//   );
// };

// export default App;



import { Routes, Route } from "react-router-dom";

// ── Existing pages (DO NOT CHANGE) ───────────────────────────────────────────
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Predict from "./pages/Predict";
import History from "./pages/History";
import Profile from "./pages/Profile";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

// ── New: Admin pages ──────────────────────────────────────────────────────────
import AdminDashboard from "../admin/AdminDashboard";

// ── New: Faculty pages ────────────────────────────────────────────────────────
import FacultyDashboard from "../src/faculty/FacultyDashboard";
import FacultyStudentDetail from "../src/faculty/FacultyStudentDetail";



const App = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <AuthProvider>
        <Routes>
          {/* ── Existing student routes (unchanged) ── */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />

          {/* ── Unified Login — handles Student, Faculty, Admin ── */}
          <Route path="/login" element={<Login />} />

          {/* ── Admin routes ── */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* ── Faculty routes ── */}
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/students/:id" element={<FacultyStudentDetail />} />
        </Routes>
      </AuthProvider>
    </>
  );
};

export default App;


