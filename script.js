const assignments = [];

const studentList = document.getElementById("student-homework-list");
const parentList = document.getElementById("parent-status-list");
const nextAssignmentEl = document.getElementById("next-assignment");
const navButtons = document.querySelectorAll(".nav-btn");
const panels = document.querySelectorAll(".panel");
const teacherForm = document.getElementById("teacher-homework-form");
const subjectInput = document.getElementById("subject-input");
const topicInput = document.getElementById("topic-input");
const dueDateInput = document.getElementById("due-date-input");
const teacherFormMessage = document.getElementById("teacher-form-message");

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;

    navButtons.forEach((btn) => btn.classList.remove("active"));
    panels.forEach((panel) => panel.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

teacherForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const subject = subjectInput.value.trim();
  const title = topicInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!subject || !title || !dueDate) {
    teacherFormMessage.textContent = "Please complete all fields before setting homework.";
    return;
  }

  assignments.push({
    id: crypto.randomUUID(),
    subject,
    title,
    dueDate,
    completed: false,
    submissionLink: ""
  });

  teacherForm.reset();
  teacherFormMessage.textContent = "Homework set successfully. Students and parents can now see it.";
  renderDashboards();
});

function renderDashboards() {
  studentList.innerHTML = "";
  parentList.innerHTML = "";

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
      Topic: ${assignment.title}<br>
      <small>Due: ${formatDate(assignment.dueDate)}</small>
      <div class="submission-controls">
        <label class="checkbox-label">
          <input type="checkbox" data-assignment-id="${assignment.id}" ${assignment.completed ? "checked" : ""}>
          Mark as completed
        </label>
        <label class="link-label" for="link-${assignment.id}">Completed work link</label>
        <input
          id="link-${assignment.id}"
          class="link-input"
          type="url"
          placeholder="https://example.com/your-work"
          value="${assignment.submissionLink || ""}"
          data-link-assignment-id="${assignment.id}"
        >
      </div>
    `;
    studentList.appendChild(studentItem);

    const parentItem = document.createElement("li");
    parentItem.className = "homework-item";

    const hoursUntilDue = Math.round((due - now) / (1000 * 60 * 60));
    const isWithin24Hours = hoursUntilDue <= 24;

    const submissionLinkMarkup = assignment.submissionLink
      ? `<p><small>Submitted work: <a href="${assignment.submissionLink}" target="_blank" rel="noopener noreferrer">Open link</a></small></p>`
      : '<p><small>No submission link yet.</small></p>';

    parentItem.innerHTML = `
      <strong>${assignment.subject}</strong>
      Topic: ${assignment.title}<br>
      <small>Due: ${formatDate(assignment.dueDate)}</small><br>
      <span class="status-pill ${assignment.completed ? "done" : "missing"}">
        ${assignment.completed ? "Completed" : "Not completed"}
      </span>
      ${submissionLinkMarkup}
      ${isWithin24Hours && !assignment.completed ? '<p><small>Parent alert: Assignment due within 24 hours and still incomplete.</small></p>' : ""}
    `;

    parentList.appendChild(parentItem);
  });

  wireStudentAssignmentControls();
}

function wireStudentAssignmentControls() {
  const checkboxes = studentList.querySelectorAll("input[type='checkbox'][data-assignment-id]");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const assignmentId = event.target.dataset.assignmentId;
      const assignment = assignments.find((item) => item.id === assignmentId);
      if (!assignment) {
        return;
      }

      if (!assignment.submissionLink.trim()) {
        event.target.checked = false;
        alert("Please add a completed work link before ticking this homework as completed.");
        return;
      }

      assignment.completed = event.target.checked;
      renderDashboards();
    });
  });

  const linkInputs = studentList.querySelectorAll("input[type='url'][data-link-assignment-id]");
  linkInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      const assignmentId = event.target.dataset.linkAssignmentId;
      const assignment = assignments.find((item) => item.id === assignmentId);
      if (!assignment) {
        return;
      }

      assignment.submissionLink = event.target.value.trim();

      if (!assignment.submissionLink) {
        assignment.completed = false;
      }

      renderDashboards();
    });
  });
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

renderDashboards();
