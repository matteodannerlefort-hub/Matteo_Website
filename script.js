const assignments = [
  {
    subject: "Mathematics",
    title: "Algebra Worksheet (Equations & Inequalities)",
    dueDate: "2026-05-20T09:00:00",
    completed: true
  },
  {
    subject: "English",
    title: "Essay plan on 'An Inspector Calls'",
    dueDate: "2026-05-21T09:00:00",
    completed: false
  },
  {
    subject: "Science",
    title: "Revision questions on electricity",
    dueDate: "2026-05-22T09:00:00",
    completed: true
  }
];

const studentList = document.getElementById("student-homework-list");
const parentList = document.getElementById("parent-status-list");
const nextAssignmentEl = document.getElementById("next-assignment");
const navButtons = document.querySelectorAll(".nav-btn");
const panels = document.querySelectorAll(".panel");

const now = new Date();
const sortedAssignments = [...assignments].sort(
  (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
);

const nextAssignment = sortedAssignments.find((a) => new Date(a.dueDate) > now);

if (nextAssignment) {
  nextAssignmentEl.innerHTML = `
    <strong>Next Reminder:</strong>
    ${nextAssignment.subject} - ${nextAssignment.title}<br>
    <small>Due: ${formatDate(nextAssignment.dueDate)}</small>
  `;
} else {
  nextAssignmentEl.innerHTML = "<strong>Great work!</strong> No upcoming homework due right now.";
}

sortedAssignments.forEach((assignment) => {
  const due = new Date(assignment.dueDate);
  const studentItem = document.createElement("li");
  studentItem.className = "homework-item";
  studentItem.innerHTML = `
    <strong>${assignment.subject}</strong>
    ${assignment.title}<br>
    <small>Due: ${formatDate(assignment.dueDate)}</small>
  `;
  studentList.appendChild(studentItem);

  const parentItem = document.createElement("li");
  parentItem.className = "homework-item";

  const hoursUntilDue = Math.round((due - now) / (1000 * 60 * 60));
  const isWithin24Hours = hoursUntilDue <= 24;

  parentItem.innerHTML = `
    <strong>${assignment.subject}</strong>
    ${assignment.title}<br>
    <small>Due: ${formatDate(assignment.dueDate)}</small><br>
    <span class="status-pill ${assignment.completed ? "done" : "missing"}">
      ${assignment.completed ? "Completed" : "Not completed"}
    </span>
    ${isWithin24Hours && !assignment.completed ? '<p><small>Parent alert: Assignment due within 24 hours and still incomplete.</small></p>' : ""}
  `;

  parentList.appendChild(parentItem);
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;

    navButtons.forEach((btn) => btn.classList.remove("active"));
    panels.forEach((panel) => panel.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}
