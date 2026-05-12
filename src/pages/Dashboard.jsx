import React from "react";
import { useMemo, useState } from "react";
import {
  BarChart3,
  Download,
  Edit,
  Eye,
  FilePlus,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Plus,
  Settings,
  Trash2
} from "lucide-react";
import { blogPosts, downloads, projects } from "../data/content.js";
import "../styles/admin.css";

const pages = {
  dashboard: "Dashboard",
  blogs: "Blog Management",
  projects: "Project Management",
  downloads: "Download Management",
  messages: "Messages",
  settings: "Settings"
};

const sampleMessages = [
  {
    id: 1,
    name: "Alex Morgan",
    email: "alex@example.com",
    message: "We need structural review support for a mixed-use tower project.",
    status: "new",
    date: "2026-05-12"
  },
  {
    id: 2,
    name: "Taylor Reed",
    email: "taylor@example.com",
    message: "Please send more details about your infrastructure consulting process.",
    status: "read",
    date: "2026-05-09"
  }
];

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState(null);

  const stats = useMemo(
    () => [
      ["Total Blogs", blogPosts.length, BarChart3, "icon-blog"],
      ["Active Projects", projects.length, FolderKanban, "icon-project"],
      ["Total Downloads", downloads.length, Download, "icon-download"],
      ["New Messages", sampleMessages.filter((message) => message.status === "new").length, Mail, "icon-message"]
    ],
    []
  );

  const openPage = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    window.history.pushState({}, "", "/login");
    window.dispatchEvent(new Event("precision:navigate"));
  };

  return (
    <main className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <h2><Settings size={22} /> Admin Panel</h2>
          <p className="admin-subtitle">Precision Engineering</p>
        </div>
        <nav className="sidebar-nav">
          <NavItem icon={<LayoutDashboard />} page="dashboard" activePage={activePage} onClick={openPage} />
          <NavItem icon={<BarChart3 />} page="blogs" activePage={activePage} onClick={openPage} />
          <NavItem icon={<FolderKanban />} page="projects" activePage={activePage} onClick={openPage} />
          <NavItem icon={<Download />} page="downloads" activePage={activePage} onClick={openPage} />
          <NavItem icon={<Mail />} page="messages" activePage={activePage} onClick={openPage} badge="3" />
          <NavItem icon={<Settings />} page="settings" activePage={activePage} onClick={openPage} />
          <div className="sidebar-footer">
            <a href="/" className="nav-item">View Site</a>
            <button className="nav-item logout-btn" onClick={logout} type="button">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </nav>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen((open) => !open)} type="button">
              <Menu />
            </button>
            <h1 id="page-title">{pages[activePage]}</h1>
          </div>
        </header>

        <section id="admin-content">
          {activePage === "dashboard" && <DashboardHome stats={stats} setActivePage={openPage} />}
          {activePage === "blogs" && <BlogTable onOpen={setModal} />}
          {activePage === "projects" && <ProjectTable onOpen={setModal} />}
          {activePage === "downloads" && <DownloadsTable onOpen={setModal} />}
          {activePage === "messages" && <MessagesTable onOpen={setModal} />}
          {activePage === "settings" && <SettingsPage />}
        </section>
      </section>

      {modal && <Modal title={modal.title} onClose={() => setModal(null)}>{modal.body}</Modal>}
    </main>
  );
}

function NavItem({ icon, page, activePage, onClick, badge }) {
  return (
    <button className={`nav-item ${activePage === page ? "active" : ""}`} onClick={() => onClick(page)} type="button">
      {icon}
      {pages[page]}
      {badge && <span className="badge">{badge}</span>}
    </button>
  );
}

function DashboardHome({ stats, setActivePage }) {
  return (
    <>
      <div className="dashboard-grid">
        {stats.map(([label, value, Icon, iconClass]) => (
          <div className="stat-card" key={label}>
            <div className={`stat-icon ${iconClass}`}><Icon /></div>
            <div className="stat-info">
              <h3>{label}</h3>
              <div className="stat-number">{value}</div>
              <div className="stat-change">Ready</div>
            </div>
          </div>
        ))}
      </div>
      <div className="admin-table-container">
        <div className="table-header"><h3 className="table-title">Quick Actions</h3></div>
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => setActivePage("blogs")} type="button"><Plus /> Add New Blog</button>
          <button className="quick-action-btn" onClick={() => setActivePage("projects")} type="button"><Plus /> Add New Project</button>
          <button className="quick-action-btn" onClick={() => setActivePage("downloads")} type="button"><FilePlus /> Add New Download</button>
          <button className="quick-action-btn" onClick={() => setActivePage("messages")} type="button"><Eye /> View Messages</button>
        </div>
      </div>
    </>
  );
}

function BlogTable({ onOpen }) {
  return (
    <TableShell title="Blog Posts" action="Add New Post" onAction={() => onOpen(blogForm())}>
      <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Actions</th></tr></thead>
      <tbody>
        {blogPosts.map((post) => (
          <tr key={post.id}>
            <td>{post.title}</td><td>{post.category}</td><td>{post.date}</td>
            <td><Actions onEdit={() => onOpen(blogForm(post))} /></td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function ProjectTable({ onOpen }) {
  return (
    <TableShell title="Projects" action="Add New Project" onAction={() => onOpen(projectForm())}>
      <thead><tr><th>Title</th><th>Category</th><th>Description</th><th>Actions</th></tr></thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id}>
            <td>{project.title}</td><td>{project.category}</td><td>{project.description.slice(0, 64)}...</td>
            <td><Actions onEdit={() => onOpen(projectForm(project))} /></td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function DownloadsTable({ onOpen }) {
  return (
    <TableShell title="Downloadable Files" action="Add New File" onAction={() => onOpen(downloadForm())}>
      <thead><tr><th>File Name</th><th>Description</th><th>Size</th><th>Actions</th></tr></thead>
      <tbody>
        {downloads.map(([name, description, size]) => (
          <tr key={name}>
            <td>{name}</td><td>{description}</td><td>{size}</td>
            <td><Actions onEdit={() => onOpen(downloadForm({ name, description, size }))} /></td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function MessagesTable({ onOpen }) {
  return (
    <TableShell title="Contact Messages">
      <thead><tr><th>Name</th><th>Email</th><th>Message Preview</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        {sampleMessages.map((message) => (
          <tr key={message.id}>
            <td>{message.name}</td><td>{message.email}</td><td>{message.message.slice(0, 48)}...</td><td>{message.date}</td>
            <td><span className={`status-badge ${message.status === "new" ? "status-pending" : "status-published"}`}>{message.status}</span></td>
            <td><Actions onEdit={() => onOpen(messageDetails(message))} viewOnly /></td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function SettingsPage() {
  return (
    <div className="admin-table-container">
      <div className="table-header"><h3 className="table-title">Site Settings</h3></div>
      <form className="form-body" onSubmit={(event) => event.preventDefault()}>
        <div className="form-group">
          <label htmlFor="site-name">Site Name</label>
          <input className="form-control" id="site-name" defaultValue="Precision Engineering Solutions" />
        </div>
        <div className="form-group">
          <label htmlFor="site-description">Site Description</label>
          <textarea className="form-control" id="site-description" rows="3" defaultValue="Leading consulting engineering firm..." />
        </div>
        <button className="btn btn-primary" type="submit">Save Settings</button>
      </form>
    </div>
  );
}

function TableShell({ title, action, onAction, children }) {
  return (
    <div className="admin-table-container">
      <div className="table-header">
        <h3 className="table-title">{title}</h3>
        {action && <button className="btn-add" onClick={onAction} type="button"><Plus size={18} /> {action}</button>}
      </div>
      <table className="admin-table">{children}</table>
    </div>
  );
}

function Actions({ onEdit, viewOnly = false }) {
  return (
    <div className="table-actions">
      <button className="btn-action btn-view" onClick={onEdit} type="button">{viewOnly ? <Eye /> : <Edit />}</button>
      {!viewOnly && <button className="btn-action btn-delete" type="button"><Trash2 /></button>}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="form-modal active" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="form-content">
        <div className="form-header">
          <h3>{title}</h3>
          <button className="close-modal" onClick={onClose} type="button">&times;</button>
        </div>
        <div className="form-body">{children}</div>
        <div className="form-footer">
          <button className="btn btn-secondary" onClick={onClose} type="button">Cancel</button>
          <button className="btn btn-primary" onClick={onClose} type="button">Save</button>
        </div>
      </div>
    </div>
  );
}

function blogForm(post = {}) {
  return {
    title: post.id ? "Edit Blog Post" : "Add New Blog Post",
    body: <AdminForm fields={[["Title", post.title], ["Category", post.category], ["Image URL", post.imageUrl], ["Description", post.description, "textarea"]]} />
  };
}

function projectForm(project = {}) {
  return {
    title: project.id ? "Edit Project" : "Add New Project",
    body: <AdminForm fields={[["Title", project.title], ["Category", project.category], ["Image URL", project.imageUrl], ["Description", project.description, "textarea"]]} />
  };
}

function downloadForm(download = {}) {
  return {
    title: download.name ? "Edit Download" : "Add New Download",
    body: <AdminForm fields={[["File Name", download.name], ["Description", download.description, "textarea"], ["File Size", download.size]]} />
  };
}

function messageDetails(message) {
  return {
    title: "Message Details",
    body: (
      <div className="message-details">
        <div className="message-field"><strong>From:</strong> {message.name}</div>
        <div className="message-field"><strong>Email:</strong> {message.email}</div>
        <div className="message-field"><strong>Date:</strong> {message.date}</div>
        <div className="message-content">{message.message}</div>
      </div>
    )
  };
}

function AdminForm({ fields }) {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      {fields.map(([label, value = "", type = "text"]) => {
        const id = label.toLowerCase().replaceAll(" ", "-");
        return (
          <div className="form-group" key={label}>
            <label htmlFor={id}>{label}</label>
            {type === "textarea" ? (
              <textarea id={id} className="form-control" rows="5" defaultValue={value} />
            ) : (
              <input id={id} className="form-control" defaultValue={value} />
            )}
          </div>
        );
      })}
    </form>
  );
}
