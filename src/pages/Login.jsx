import React from "react";
import { Eye, EyeOff, Lock, Settings, User } from "lucide-react";
import { useState } from "react";
import "../styles/login.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password.trim()) {
      setError("Username and password cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      const data = await response.json();
      localStorage.setItem("admin_token", data.token || "local-token");
      window.history.pushState({}, "", "/dashboard");
      window.dispatchEvent(new Event("precision:navigate"));
    } catch (requestError) {
      setError(requestError.message || "Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="bg-pattern" />
      <div className="particles" />
      <div className="login-container">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon"><Settings size={36} /></div>
            <h1>Precision Engineering</h1>
            <p>Admin Panel Access</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <User size={18} />
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="Enter your username"
                value={form.username}
                onChange={updateField}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={form.password}
                onChange={updateField}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Signing In..." : "Sign In to Dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}
