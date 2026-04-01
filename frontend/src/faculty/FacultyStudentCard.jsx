/**
 * FacultyStudentCard
 * A clickable card showing a student's basic info.
 */
const FacultyStudentCard = ({ student, onClick }) => {
  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="fac-student-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className="fac-student-avatar">{initials}</div>
      <div className="fac-student-info">
        <h3 className="fac-student-name">{student.name}</h3>
        <p className="fac-student-detail">📧 {student.email}</p>
        <p className="fac-student-detail">🎓 Sem {student.semester} &nbsp;|&nbsp; {student.department}</p>
        {student.enrollmentNo && (
          <p className="fac-student-detail">🆔 {student.enrollmentNo}</p>
        )}
      </div>
      <div className="fac-student-arrow">›</div>
    </div>
  );
};

export default FacultyStudentCard;
