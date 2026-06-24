import React from "react";
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2, Lock, Settings, User } from "lucide-react";
import { useState } from "react";
import "../styles/login.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!form.password.trim()) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/Account/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: form.username,
          password: form.password
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      const token = data.accessToken;
      if (!token) {
        throw new Error("Server did not return an access token.");
      }

      localStorage.setItem("admin_token", token);
      setCookie("admin_token", token, 7);

      // Show success message briefly before redirect
      setSuccess("Login successful! Redirecting to dashboard...");
      await new Promise((resolve) => setTimeout(resolve, 800));

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

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="success-message">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

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
            {loading ? (
              <>
                <Loader2 size={20} className="spinner" />
                Signing In...
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
