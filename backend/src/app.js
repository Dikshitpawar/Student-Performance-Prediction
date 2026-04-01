// const express= require('express');
// const cors = require('cors');
// const authRoutes = require('./routes/auth.routes');
// const performanceRoutes = require('./routes/studentPerformance.route');
// // const facultyRoutes = require('../faculty/facultyRoutes');
// const cookieParser = require('cookie-parser');

// const app = express();

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));

// app.use(express.json());
// app.use(cookieParser());

// // ✅ Routes
// app.use("/api/auth" , authRoutes);
// app.use("/api/performance" , performanceRoutes);
// // app.use("/api/faculty" , facultyRoutes);

// module.exports = app;



const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// ── Existing Routes (DO NOT CHANGE) ──────────────────────────────────────────
const authRoutes = require('../src/routes/auth.routes');
const performanceRoutes = require('../src/routes/studentPerformance.route');

// ── New Routes ────────────────────────────────────────────────────────────────
const adminRoutes = require('../admin/adminRoutes');
const facultyRoutes = require('../faculty/facultyRoutes');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ── Existing API routes ───────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/performance', performanceRoutes);

// ── New API routes ────────────────────────────────────────────────────────────
app.use('/api/admin', adminRoutes);
app.use('/api/faculty', facultyRoutes);

module.exports = app;