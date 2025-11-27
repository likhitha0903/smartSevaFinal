/* ============================
   SmartSeva – Dashboard (Session-Based)
   ============================ */

const API_BASE_URL = "http://localhost:9654/api";

/* ----------------------------
   AUTH CHECK (NO localStorage)
----------------------------- */
async function getLoggedInUser() {
  try {
    const res = await fetch(`${API_BASE_URL}/user/current`, {
      credentials: "include"
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user; // { id, name, email }
  } catch {
    return null;
  }
}

async function requireSessionLogin() {
  const user = await getLoggedInUser();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

/* ----------------------------
   DATE FORMAT
----------------------------- */
function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

/* ----------------------------
   FETCH COMPLAINTS (Session Cookie)
----------------------------- */
async function fetchMyComplaints() {
  const res = await fetch(`${API_BASE_URL}/complaints/my`, {
    credentials: "include"
  });

  if (!res.ok) throw new Error("Failed to fetch complaints");

  return res.json();
}

/* ----------------------------
   RENDER TABLES
----------------------------- */
function renderTables(complaints) {
  const allBody = document.getElementById("table-all-body");
  const progressBody = document.getElementById("table-progress-body");
  const resolvedBody = document.getElementById("table-resolved-body");

  const totalCountEl = document.getElementById("totalCount");
  const progressCountEl = document.getElementById("progressCount");
  const resolvedCountEl = document.getElementById("resolvedCount");

  allBody.innerHTML = "";
  progressBody.innerHTML = "";
  resolvedBody.innerHTML = "";

  let total = 0, prog = 0, done = 0;

  complaints.forEach(c => {
    total++;

    const status = (c.status || "").toUpperCase();
    const created = formatDate(c.createdAt);

    const row = `
      <tr>
        <td class="complaint-id">${c.ticketId || "-"}</td>
        <td>${c.category || "-"}</td>
        <td>${c.location || "-"}</td>
        <td>${created}</td>
        <td>
          ${
            status === "RESOLVED"
              ? `<span class="status-pill status-resolved">Resolved</span>`
              : status === "IN_PROGRESS"
              ? `<span class="status-pill status-progress">In Progress</span>`
              : `<span class="status-pill status-open">Open</span>`
          }
        </td>
        <td class="text-end">
          <a href="#" class="btn btn-outline-sm">View</a>
        </td>
      </tr>
    `;

    allBody.innerHTML += row;

    if (status === "RESOLVED") {
      resolvedBody.innerHTML += row;
      done++;
    } else if (status === "IN_PROGRESS") {
      progressBody.innerHTML += row;
      prog++;
    }
  });

  totalCountEl.textContent = total;
  progressCountEl.textContent = prog;
  resolvedCountEl.textContent = done;

  if (complaints.length === 0) {
    allBody.innerHTML = `<tr><td colspan="6" class="text-muted text-center">No complaints yet.</td></tr>`;
  }
}

/* ----------------------------
   MAIN DASHBOARD LOADER
----------------------------- */
async function initDashboard() {
  const user = await requireSessionLogin();
  if (!user) return; // not logged in → redirected

  console.log("Logged in:", user);

  try {
    const complaints = await fetchMyComplaints();
    renderTables(complaints);
  } catch (err) {
    console.error(err);
    // alert("Could not load complaints.");
  }
}

document.addEventListener("DOMContentLoaded", initDashboard);