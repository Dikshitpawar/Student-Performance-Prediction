import { useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import "../styles/Navbar.css";
import { authContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";




/**
 * Navbar — role-aware
 *
 * Shows different links based on who is logged in:
 *  - Student  (token in localStorage)       → Predict | History | Profile | Logout
 *  - Faculty  (facultyToken in localStorage) → Dashboard | Logout
 *  - Admin    (adminToken in localStorage)   → Dashboard | Logout
 *  - Nobody                                  → Get Started
 */
const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, setStudent } = useContext(authContext);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect faculty / admin tokens (not managed by AuthContext — stored separately)
  const facultyToken = localStorage.getItem("facultyToken");
  const adminToken = localStorage.getItem("adminToken");
  const facultyInfo = facultyToken
    ? JSON.parse(localStorage.getItem("facultyInfo") || "{}")
    : null;
  const adminInfo = adminToken
    ? JSON.parse(localStorage.getItem("adminInfo") || "{}")
    : null;

  // Recheck on every render so navbar updates right after login/logout
  const isStudent = !!token;
  const isFaculty = !!facultyToken;
  const isAdmin = !!adminToken;
  const isLoggedIn = isStudent || isFaculty || isAdmin;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  // ── Logout handlers ──────────────────────────────────────────────────────
  const handleStudentLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    setToken(null);
    setStudent(null);
    toast.success("Logged out successfully");
    navigate("/login");
    closeMenu();
  };

  const handleFacultyLogout = () => {
    localStorage.removeItem("facultyToken");
    localStorage.removeItem("facultyInfo");
    toast.success("Logged out successfully");
    navigate("/login");
    closeMenu();
    // Force re-render by reloading (simplest way since faculty state isn't in context)
    window.location.href = "/login";
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>

      {/* LOGO */}
      <div className="logo" onClick={() => { navigate("/"); closeMenu(); }}>
        🎓 SmartPredict
      </div>

      {/* NAV LINKS */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>

        {/* ── Nobody logged in ── */}
        {!isLoggedIn && (
          <button
            className="btn-primary"
            onClick={() => { navigate("/login"); closeMenu(); }}
          >
            Get Started
          </button>
        )}

        {/* ── Student logged in ── */}
        {isStudent && (
          <>
            <NavLink to="/predict" className="nav-item" onClick={closeMenu}>Predict</NavLink>
            <NavLink to="/history" className="nav-item" onClick={closeMenu}>History</NavLink>
            <NavLink to="/profile" className="nav-item" onClick={closeMenu}>Profile</NavLink>
            <button className="logout-btn" onClick={handleStudentLogout}>Logout</button>
          </>
        )}

        {/* ── Faculty logged in ── */}
        {isFaculty && !isStudent && (
          <>
            <span className="nav-role-badge faculty-badge">
               {facultyInfo?.name || "Faculty"}
            </span>
            <NavLink to="/faculty/dashboard" className="nav-item" onClick={closeMenu}>
              Dashboard
            </NavLink>
            <button className="logout-btn" onClick={handleFacultyLogout}>Logout</button>
          </>
        )}

        {/* ── Admin logged in ── */}
        {isAdmin && !isStudent && !isFaculty && (
          <>
            <span className="nav-role-badge admin-badge">
              🛡️ {adminInfo?.name || "Admin"}
            </span>
            <NavLink to="/admin/dashboard" className="nav-item" onClick={closeMenu}>
              Dashboard
            </NavLink>
            <button className="logout-btn" onClick={handleAdminLogout}>Logout</button>
          </>
        )}

      </ul>

      {/* HAMBURGER */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✖" : "☰"}
      </div>

    </nav>
  );
};

export default Navbar;
