document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const loginBtn = document.getElementById("loginBtn");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        loginBtn.innerText = "Authenticating...";
        loginBtn.disabled = true;

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert("Login gagal: " + error.message);
            loginBtn.innerText = "Sign In";
            loginBtn.disabled = false;
        } else {
            // Simpan sesi login (opsional, Supabase JS sudah otomatis menyimpannya di localStorage)
            window.location.href = "admin.html";
        }
    });
});