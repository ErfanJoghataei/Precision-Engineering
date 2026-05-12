import React from "react";
import { useMemo, useState } from "react";
import { Clock, FileText, Mail, MapPin, Phone } from "lucide-react";
import { blogPosts, downloads, projects } from "../data/content.js";

const categories = ["all", ...new Set(projects.map((project) => project.category))];

const categoryName = (category) =>
  ({
    all: "All Projects",
    infrastructure: "Infrastructure",
    structural: "Structural",
    environmental: "Environmental",
    transportation: "Transportation"
  })[category] || category;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const filteredProjects = useMemo(
    () =>
      activeCategory === "all"
        ? projects
        : projects.filter((project) => project.category === activeCategory),
    [activeCategory]
  );

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
            <li><a href="/login">Admin</a></li>
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
            {blogPosts.map((post) => (
              <article className="blog-card" key={post.id}>
                <div className="blog-image" style={{ backgroundImage: `url("${post.imageUrl}")` }} />
                <div className="blog-content">
                  <span className="blog-category">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <div className="blog-meta">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
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
            {downloads.map(([title, description, meta]) => (
              <div className="download-item" key={title}>
                <div className="download-icon"><FileText size={48} /></div>
                <div className="download-content">
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className="download-meta">{meta}</span>
                </div>
                <a href="#downloads" className="btn-download">Download</a>
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
            <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="6" required />
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
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
