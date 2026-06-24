import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Clock, FileText, Mail, MapPin, Phone, User } from "lucide-react";

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

const categoryName = (category) =>
  ({
    all: "All Projects",
    infrastructure: "Infrastructure",
    structural: "Structural",
    environmental: "Environmental",
    transportation: "Transportation"
  })[category] || category;

const getCookie = (name) =>
  document.cookie.split("; ").reduce((result, cookie) => {
    const [key, value] = cookie.split("=");
    return key === name ? decodeURIComponent(value) : result;
  }, "");

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    const token = getCookie("admin_token") || localStorage.getItem("admin_token");
    setIsLoggedIn(Boolean(token));
  }, []);

  const fetchHomeData = useCallback(async () => {
    try {
      const res = await fetch("/api/Home");
      if (res.ok) {
        const data = await res.json();
        setHomeData(data);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const insights = homeData?.insights ?? [];
  const projects = homeData?.projects ?? [];
  const files = homeData?.files ?? [];

  const categories = useMemo(() => ["all", ...new Set(projects.map((p) => p.category))], [projects]);

  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    messageText: ""
  });
  const [contactErrors, setContactErrors] = useState({});
  const [contactStatus, setContactStatus] = useState({ type: "", message: "" });
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const filteredProjects = useMemo(
    () =>
      activeCategory === "all"
        ? projects
        : projects.filter((project) => project.category === activeCategory),
    [activeCategory, projects]
  );

  useEffect(() => {
    if (!contactStatus.message) return undefined;

    const timerId = window.setTimeout(() => {
      setContactStatus({ type: "", message: "" });
    }, 5000);

    return () => window.clearTimeout(timerId);
  }, [contactStatus.message]);

  const validateContactForm = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fullName = contactForm.fullName.trim();
    const email = contactForm.email.trim();
    const messageText = contactForm.messageText.trim();

    if (!fullName) errors.fullName = "Full name is required.";
    else if (fullName.length > 100) errors.fullName = "Full name must be 100 characters or less.";

    if (!email) errors.email = "Email address is required.";
    else if (!emailPattern.test(email)) errors.email = "Enter a valid email address.";
    else if (email.length > 150) errors.email = "Email address must be 150 characters or less.";

    if (!messageText) errors.messageText = "Message is required.";
    else if (messageText.length > 1000) errors.messageText = "Message must be 1000 characters or less.";

    return errors;
  };

  const updateContactField = (event) => {
    const { name, value } = event.target;
    setContactForm((current) => ({ ...current, [name]: value }));
    setContactErrors((current) => ({ ...current, [name]: "" }));
    setContactStatus({ type: "", message: "" });
  };

  const submitContactForm = async (event) => {
    event.preventDefault();

    const errors = validateContactForm();
    setContactErrors(errors);

    if (Object.keys(errors).length > 0) {
      setContactStatus({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setIsSendingMessage(true);
    setContactStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/Contact/Send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FullName: contactForm.fullName.trim(),
          Email: contactForm.email.trim(),
          MessageText: contactForm.messageText.trim()
        })
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Message could not be sent.");
      }

      setContactForm({ fullName: "", email: "", messageText: "" });
      setContactErrors({});
      setContactStatus({ type: "success", message: result.message || "Your message has been sent." });
    } catch (error) {
      setContactStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again."
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <a href="#home" className="logo">Precision Engineering</a>
          <ul className="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#downloads">Downloads</a></li>
            <li><a href="#contact">Contact</a></li>
            <li>
              {isLoggedIn ? (
                <a href="/dashboard" className="nav-profile-btn">
                  <span className="nav-profile-icon"><User size={16} /></span>
                  Profile
                </a>
              ) : (
                <a href="/login">Admin</a>
              )}
            </li>
          </ul>
        </div>
      </nav>

      <section id="home" className="hero">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <h1>Engineering Excellence for Tomorrow</h1>
          <p className="hero-subtitle">
            Innovative consulting solutions for infrastructure, structural, and environmental challenges
          </p>
          <a href="#contact" className="btn btn-primary">Start Your Project</a>
        </div>
      </section>

      <section id="blog" className="section">
        <div className="container">
          <h2 className="section-title">Latest Insights</h2>
          <p className="section-subtitle">Expert perspectives on engineering trends and innovations</p>
          <div className="blog-grid">
            {insights.map((insight) => (
              <article className="blog-card" key={insight.id}>
                <div className="blog-image" style={{ backgroundImage: `url("${insight.imagePath}")` }} />
                <div className="blog-content">
                  <span className="blog-category">{insight.category}</span>
                  <h3>{insight.title}</h3>
                  <p>{insight.description}</p>
                  <div className="blog-meta">
                    <span>{new Date(insight.createdDate).toLocaleDateString()}</span>
                    <span>{insight.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="section section-alt">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">Delivering excellence across diverse engineering disciplines</p>
          <div className="filter-bar">
            {categories.map((category) => (
              <button
                className={`filter-btn ${activeCategory === category ? "active" : ""}`}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {categoryName(category)}
              </button>
            ))}
          </div>
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <article className="project-card" key={project.id}>
                <div className="project-image" style={{ backgroundImage: `url("${project.imageUrl}")` }} />
                <div className="project-overlay">
                  <span className="project-category">{categoryName(project.category)}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="downloads" className="section">
        <div className="container">
          <h2 className="section-title">Download Center</h2>
          <p className="section-subtitle">Access our technical resources and documentation</p>
          <div className="downloads-grid">
            {files.map((file) => (
              <div className="download-item" key={file.id}>
                <div className="download-icon"><FileText size={48} /></div>
                <div className="download-content">
                  <h3>{file.fileName}</h3>
                  <p>{file.description || ""}</p>
                  <span className="download-meta">PDF - {formatFileSize(file.size)}</span>
                </div>
                <a href={file.filePath} className="btn-download" target="_blank" rel="noopener noreferrer">Download</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section section-alt">
        <div className="container">
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-subtitle">Let's discuss how we can help with your next project</p>
          <div className="contact-wrapper">
            <form className="contact-form" onSubmit={submitContactForm} noValidate>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={contactForm.fullName}
                  onChange={updateContactField}
                  maxLength="100"
                  aria-invalid={Boolean(contactErrors.fullName)}
                  aria-describedby={contactErrors.fullName ? "fullName-error" : undefined}
                  required
                />
                {contactErrors.fullName ? <span className="form-error" id="fullName-error">{contactErrors.fullName}</span> : null}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactForm.email}
                  onChange={updateContactField}
                  maxLength="150"
                  aria-invalid={Boolean(contactErrors.email)}
                  aria-describedby={contactErrors.email ? "email-error" : undefined}
                  required
                />
                {contactErrors.email ? <span className="form-error" id="email-error">{contactErrors.email}</span> : null}
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="messageText"
                  rows="6"
                  value={contactForm.messageText}
                  onChange={updateContactField}
                  maxLength="1000"
                  aria-invalid={Boolean(contactErrors.messageText)}
                  aria-describedby={contactErrors.messageText ? "message-error" : undefined}
                  required
                />
                {contactErrors.messageText ? <span className="form-error" id="message-error">{contactErrors.messageText}</span> : null}
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSendingMessage}>
                {isSendingMessage ? "Sending..." : "Send Message"}
              </button>
              {contactStatus.message ? (
                <div className={`form-status ${contactStatus.type}`} role="status" aria-live="polite">
                  {contactStatus.message}
                </div>
              ) : null}
            </form>

            <div className="contact-info">
              <Info icon={<MapPin />} title="Office Location">123 Engineering Plaza<br />Suite 400<br />Metro City, ST 12345</Info>
              <Info icon={<Phone />} title="Phone">Main: (555) 123-4567<br />Fax: (555) 123-4568</Info>
              <Info icon={<Mail />} title="Email">info@precisioneng.com<br />careers@precisioneng.com</Info>
              <Info icon={<Clock />} title="Business Hours">Monday - Friday: 8:00 AM - 6:00 PM<br />Saturday: 9:00 AM - 1:00 PM</Info>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h3>Precision Engineering</h3>
              <p>Leading the way in innovative consulting engineering solutions for over 25 years.</p>
            </div>
            <FooterList title="Services" items={["Structural Engineering", "Infrastructure Design", "Environmental Solutions", "Transportation Planning"]} />
            <FooterList title="Company" items={["About Us", "Careers", "Certifications", "Partners"]} />
            <FooterList title="Resources" items={["Blog", "Downloads", "FAQ", "Privacy Policy"]} />
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Precision Engineering Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

function Info({ icon, title, children }) {
  return (
    <div className="info-card">
      <div className="info-icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{children}</p>
      </div>
    </div>
  );
}

function FooterList({ title, items }) {
  return (
    <div className="footer-column">
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}><a href="#home">{item}</a></li>
        ))}
      </ul>
    </div>
  );
}
