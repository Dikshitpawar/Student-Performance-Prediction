import "../styles/StudentCard.css";

const StudentCard = ({ student }) => {
  return (
    <div className={`student-card ${student.status.toLowerCase()}`}>
      <h3>{student.name}</h3>
      <p><b>ID:</b> {student.id}</p>
      <p><b>Department:</b> {student.department}</p>

      <div className="stats">
        <span>Attendance: {student.attendance}%</span>
        <span>Marks: {student.marks}</span>
      </div>

      <div className="status">
        {student.status}
      </div>
    </div>
  );
};

export default StudentCard;
