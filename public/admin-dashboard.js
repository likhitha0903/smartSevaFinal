const REQUIRED_ADMIN_ID = "GEID-IND-EDU-2025-000123-7";

function loadAdminNavbar() {
    fetch("http://localhost:9654/api/admin/current")
        .then(res => res.json())
        .then(admin => {
            const adminMenu = document.getElementById("navAdminLoggedIn");

            // If admin exists and ID matches
            if (admin && admin.adminId === REQUIRED_ADMIN_ID) {
                adminMenu.classList.remove("d-none");
                document.getElementById("navAdminName").innerText = "ADMIN";
                document.getElementById("navAdminAvatar").innerText = "A";
            } else {
                // Redirect to admin login if not logged in
                window.location.href = "adminlogin.html";
            }
        })
        .catch(() => {
            window.location.href = "adminlogin.html";
        });
}

// Logout setup
function setupAdminLogout() {
    const btn = document.getElementById("btnAdminLogout");
    if (!btn) return;

    btn.addEventListener("click", async () => {
        try {
            await fetch("http://localhost:9654/api/admin/logout", { method: "POST" });
            window.location.href = "adminlogin.html";
        } catch (err) {
            console.error("Logout failed:", err);
        }
    });
}

loadAdminNavbar();
setupAdminLogout();