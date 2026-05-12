// Public/JS/login.js

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("errorMessage");
    const errorText = document.getElementById("errorText");

    // ابتدا خطا رو مخفی می‌کنیم
    errorMessage.style.display = "none";

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // جلوگیری از submit پیش‌فرض

        // دریافت مقادیر
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // اعتبارسنجی خالی بودن
        if (!username || !password) {
            showError("Username and password cannot be empty.");
            return;
        }

        try {
            // ارسال داده به سرور
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // ورود موفق
                // ذخیره توکن در localStorage یا sessionStorage
                localStorage.setItem("token", data.token);

                // redirect به داشبورد ادمین
                window.location.href = "/Private/HTML/dashboard/dashboard.html";
            } else {
                // خطای لاگین
                showError(data.message || "Invalid credentials. Please try again.");
            }
        } catch (error) {
            showError("Server error. Please try again later.");
            console.error(error);
        }
    });

    // تابع نمایش خطا
    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = "block";
    }

    // toggle نمایش/عدم نمایش پسورد
    const togglePasswordBtn = document.getElementById("togglePassword");
    togglePasswordBtn.addEventListener("click", () => {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
    });
});
