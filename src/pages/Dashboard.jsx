import React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Download,
  Edit,
  Eye,
  FilePlus,
  FolderKanban,
  Image,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Plus,
  Settings,
  Trash2,
  Upload
} from "lucide-react";

import "../styles/admin.css";

const pages = {
  dashboard: "Dashboard",
  blogs: "Blog Management",
  projects: "Project Management",
  downloads: "Download Management",
  messages: "Messages"
};

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/DashBoard", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardStats(data);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    if (activePage === "dashboard") {
      fetchDashboardStats();
    }
  }, [activePage, fetchDashboardStats]);

  const stats = useMemo(
    () => [
      ["Total Blogs", dashboardStats?.insightsCount ?? 0, BarChart3, "icon-blog"],
      ["Active Projects", dashboardStats?.projectsCount ?? 0, FolderKanban, "icon-project"],
      ["Total Downloads", dashboardStats?.downloadsCount ?? 0, Download, "icon-download"],
      ["Messages", dashboardStats?.messagesCount ?? 0, Mail, "icon-message"]
    ],
    [dashboardStats]
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
          <NavItem icon={<Mail />} page="messages" activePage={activePage} onClick={openPage} />
          <div className="sidebar-footer">
            <button className="nav-item" onClick={() => {
              window.history.pushState({}, "", "/");
              window.dispatchEvent(new Event("precision:navigate"));
            }} type="button">
              View Site
            </button>
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
        </section>
      </section>

      {modal && <Modal title={modal.title} onClose={() => setModal(null)} onSave={modal.onSave}>{modal.body}</Modal>}
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
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/Insights", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Failed to fetch insights");
      const data = await res.json();
      setInsights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this insight?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/Insights/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Delete failed");
      }
      fetchInsights();
    } catch (err) {
      window.alert(err.message);
    }
  };

  if (loading) {
    return (
      <TableShell title="Blog Posts">
        <div className="loading-state"><Loader2 className="spinner" size={20} /> Loading insights...</div>
      </TableShell>
    );
  }

  if (error) {
    return (
      <TableShell title="Blog Posts" action="Add New Post" onAction={() => onOpen(blogForm(() => onOpen(null)))}>
        <div className="error-state"><AlertCircle size={18} /> {error}</div>
      </TableShell>
    );
  }

  return (
    <TableShell title="Blog Posts" action="Add New Post" onAction={() => onOpen(blogForm(() => onOpen(null)))}>
      <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Actions</th></tr></thead>
      <tbody>
        {insights.length === 0 ? (
          <tr><td colSpan="4" className="empty-state">No blog posts yet. Click "Add New Post" to create one.</td></tr>
        ) : (
          insights.map((insight) => (
            <tr key={insight.id}>
              <td>{insight.title}</td>
              <td>{insight.category}</td>
              <td>{new Date(insight.createdDate).toLocaleDateString()}</td>
              <td>
                <div className="table-actions">
                  <button className="btn-action btn-view" onClick={() => onOpen(blogForm(() => onOpen(null), insight))} type="button"><Edit /></button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(insight.id)} type="button"><Trash2 /></button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </TableShell>
  );
}

function ProjectTable({ onOpen }) {
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/Project", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjectList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/Project/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Delete failed");
      }
      fetchProjects();
    } catch (err) {
      window.alert(err.message);
    }
  };

  if (loading) {
    return (
      <TableShell title="Projects">
        <div className="loading-state"><Loader2 className="spinner" size={20} /> Loading projects...</div>
      </TableShell>
    );
  }

  if (error) {
    return (
      <TableShell title="Projects" action="Add New Project" onAction={() => onOpen(projectForm(() => onOpen(null)))}>
        <div className="error-state"><AlertCircle size={18} /> {error}</div>
      </TableShell>
    );
  }

  return (
    <TableShell title="Projects" action="Add New Project" onAction={() => onOpen(projectForm(() => onOpen(null)))}>
      <thead><tr><th>Title</th><th>Category</th><th>Description</th><th>Actions</th></tr></thead>
      <tbody>
        {projectList.length === 0 ? (
          <tr><td colSpan="4" className="empty-state">No projects yet. Click "Add New Project" to create one.</td></tr>
        ) : (
          projectList.map((project) => (
            <tr key={project.id}>
              <td>{project.title}</td>
              <td>{project.category}</td>
              <td>{project.description.slice(0, 64)}...</td>
              <td>
                <div className="table-actions">
                  <button className="btn-action btn-view" onClick={() => onOpen(projectForm(() => onOpen(null), project))} type="button"><Edit /></button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(project.id)} type="button"><Trash2 /></button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </TableShell>
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function DownloadsTable({ onOpen }) {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/File", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      setFileList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/File/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Delete failed");
      }
      fetchFiles();
    } catch (err) {
      window.alert(err.message);
    }
  };

  if (loading) {
    return (
      <TableShell title="Downloadable Files">
        <div className="loading-state"><Loader2 className="spinner" size={20} /> Loading files...</div>
      </TableShell>
    );
  }

  if (error) {
    return (
      <TableShell title="Downloadable Files" action="Add New File" onAction={() => onOpen(downloadForm(() => onOpen(null)))}>
        <div className="error-state"><AlertCircle size={18} /> {error}</div>
      </TableShell>
    );
  }

  return (
    <TableShell title="Downloadable Files" action="Add New File" onAction={() => onOpen(downloadForm(() => onOpen(null)))}>
      <thead><tr><th>File Name</th><th>Description</th><th>Size</th><th>Actions</th></tr></thead>
      <tbody>
        {fileList.length === 0 ? (
          <tr><td colSpan="4" className="empty-state">No files yet. Click "Add New File" to upload one.</td></tr>
        ) : (
          fileList.map((file) => (
            <tr key={file.id}>
              <td>{file.fileName}</td>
              <td>{file.description || "—"}</td>
              <td>{formatFileSize(file.size)}</td>
              <td>
                <div className="table-actions">
                  <button className="btn-action btn-view" onClick={() => onOpen(downloadForm(() => onOpen(null), file))} type="button"><Edit /></button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(file.id)} type="button"><Trash2 /></button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </TableShell>
  );
}

function MessagesTable({ onOpen }) {
  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/Contact", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessageList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/Contact/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Delete failed");
      }
      fetchMessages();
    } catch (err) {
      window.alert(err.message);
    }
  };

  if (loading) {
    return (
      <TableShell title="Contact Messages">
        <div className="loading-state"><Loader2 className="spinner" size={20} /> Loading messages...</div>
      </TableShell>
    );
  }

  if (error) {
    return (
      <TableShell title="Contact Messages">
        <div className="error-state"><AlertCircle size={18} /> {error}</div>
      </TableShell>
    );
  }

  return (
    <TableShell title="Contact Messages">
      <thead><tr><th>Name</th><th>Email</th><th>Message Preview</th><th>Date</th><th>Actions</th></tr></thead>
      <tbody>
        {messageList.length === 0 ? (
          <tr><td colSpan="5" className="empty-state">No messages yet.</td></tr>
        ) : (
          messageList.map((message) => (
            <tr key={message.id}>
              <td>{message.fullName}</td>
              <td>{message.email}</td>
              <td>{message.messageText.slice(0, 48)}...</td>
              <td>{new Date(message.sentAt).toLocaleDateString()}</td>
              <td>
                <div className="table-actions">
                  <button className="btn-action btn-view" onClick={() => onOpen(messageDetails(message))} type="button"><Eye /></button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(message.id)} type="button"><Trash2 /></button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </TableShell>
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

function Modal({ title, onClose, onSave, children }) {
  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      onClose();
    }
  };

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
          <button className="btn btn-primary" onClick={handleSave} type="button">Save</button>
        </div>
      </div>
    </div>
  );
}

function BlogFormContent({ onClose, onSaveRef, insight }) {
  const [title, setTitle] = useState(insight?.title || "");
  const [description, setDescription] = useState(insight?.description || "");
  const [readTime, setReadTime] = useState("");
  const [category, setCategory] = useState(insight?.category || "Sustainability");
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async () => {
    if (saving) return;

    if (!title.trim()) {
      setStatus({ type: "error", message: "Title is required" });
      return;
    }
    if (!description.trim()) {
      setStatus({ type: "error", message: "Description is required" });
      return;
    }
    if (!readTime && !insight) {
      setStatus({ type: "error", message: "Read time is required" });
      return;
    }
    if (!selectedFile) {
      setStatus({ type: "error", message: "Please select an image" });
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append("Title", title.trim());
      formData.append("Description", description.trim());
      formData.append("Category", category);
      if (selectedFile) formData.append("InsightImage", selectedFile);

      let url = "/api/Insights";
      let method = "POST";

      if (insight) {
        formData.append("Id", insight.id);
        formData.append("Title", title.trim());
        formData.append("Description", description.trim());
        formData.append("ReadTimeInMinut", readTime || "5");
        method = "PUT";
      } else {
        formData.append("ReadTimeInMinutes", readTime || "5");
      }

      const res = await fetch(url, {
        method,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus({ type: "success", message: result.message || (insight ? "Insight updated!" : "Insight created!") });
        setTimeout(() => onClose(), 1500);
      } else {
        throw new Error(result.message || "Operation failed");
      }
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  React.useEffect(() => {
    if (onSaveRef) onSaveRef.current = handleSubmit;
  });

  return (
    <>
      <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          hidden
        />
        {selectedFile ? (
          <div className="upload-file-info">
            <Image size={32} />
            <span className="upload-file-name">{selectedFile.name}</span>
          </div>
        ) : insight?.imagePath ? (
          <div className="upload-file-info">
            <Image size={32} />
            <span className="upload-file-name">Current: {insight.imagePath.split("/").pop()}</span>
            <span className="upload-hint">Click to change image</span>
          </div>
        ) : (
          <div className="upload-placeholder">
            <Image size={36} />
            <span>Click to select an image</span>
            <span className="upload-hint">JPG, JPEG, PNG, WebP - Max 5 MB</span>
          </div>
        )}
      </div>
      <div className="upload-form-fields">
        <div className="form-group">
          <label htmlFor="blog-title">Title</label>
          <input
            id="blog-title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter insight title"
            maxLength={70}
          />
        </div>
        <div className="form-group">
          <label htmlFor="blog-category">Category</label>
          <select
            id="blog-category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Sustainability">Sustainability</option>
            <option value="Structural">Structural</option>
            <option value="Technology">Technology</option>
            <option value="Environmental">Environmental</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="blog-readtime">Read Time (minutes)</label>
          <input
            id="blog-readtime"
            className="form-control"
            type="number"
            min="1"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div className="form-group">
          <label htmlFor="blog-desc">Description</label>
          <textarea
            id="blog-desc"
            className="form-control"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write insight content..."
            maxLength={1000}
          />
        </div>
        {status && (
          <div className={`upload-status ${status.type === "success" ? "upload-success" : "upload-error"}`}>
            {status.message}
          </div>
        )}
      </div>
    </>
  );
}

function blogForm(onClose, insight = null) {
  const saveRef = { current: null };
  return {
    title: insight ? "Edit Blog Post" : "Add New Blog Post",
    body: <BlogFormContent onClose={onClose} onSaveRef={saveRef} insight={insight} />,
    onSave: () => saveRef.current?.()
  };
}

function ProjectFormContent({ onClose, onSaveRef, project }) {
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [category, setCategory] = useState(project?.category || "Infrastructure");
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async () => {
    if (saving) return;

    if (!title.trim()) {
      setStatus({ type: "error", message: "Title is required" });
      return;
    }
    if (!description.trim()) {
      setStatus({ type: "error", message: "Description is required" });
      return;
    }
    if (!selectedFile) {
      setStatus({ type: "error", message: "Please select an image" });
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();

      if (project) {
        // Edit: uses EditProjectDto field names (lowercase) + ID in URL
        formData.append("newtitle", title.trim());
        formData.append("newdescription", description.trim());
        formData.append("newcategory", category);
        formData.append("newimage", selectedFile);

        const res = await fetch(`/api/Project/${project.id}`, {
          method: "PUT",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData
        });

        const result = await res.json().catch(() => ({}));

        if (res.ok) {
          setStatus({ type: "success", message: result.message || "Project updated!" });
          setTimeout(() => onClose(), 1500);
        } else {
          throw new Error(result.message || "Edit failed");
        }
      } else {
        // Create: uses CreateProjectDto field names
        formData.append("Title", title.trim());
        formData.append("Description", description.trim());
        formData.append("Category", category);
        formData.append("ProjectImage", selectedFile);

        const res = await fetch("/api/Project", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData
        });

        const result = await res.json().catch(() => ({}));

        if (res.ok) {
          setStatus({ type: "success", message: result.message || "Project created!" });
          setTimeout(() => onClose(), 1500);
        } else {
          throw new Error(result.message || "Create failed");
        }
      }
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  React.useEffect(() => {
    if (onSaveRef) onSaveRef.current = handleSubmit;
  });

  return (
    <>
      <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          hidden
        />
        {selectedFile ? (
          <div className="upload-file-info">
            <Image size={32} />
            <span className="upload-file-name">{selectedFile.name}</span>
          </div>
        ) : project?.imagePath ? (
          <div className="upload-file-info">
            <Image size={32} />
            <span className="upload-file-name">Current: {project.imagePath.split("/").pop()}</span>
            <span className="upload-hint">Click to change image</span>
          </div>
        ) : (
          <div className="upload-placeholder">
            <Image size={36} />
            <span>Click to select an image</span>
            <span className="upload-hint">JPG, JPEG, PNG, WebP - Max 5 MB</span>
          </div>
        )}
      </div>
      <div className="upload-form-fields">
        <div className="form-group">
          <label htmlFor="project-title">Title</label>
          <input
            id="project-title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter project title"
            maxLength={100}
          />
        </div>
        <div className="form-group">
          <label htmlFor="project-category">Category</label>
          <select
            id="project-category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Infrastructure">Infrastructure</option>
            <option value="Structural">Structural</option>
            <option value="Environmental">Environmental</option>
            <option value="Transportation">Transportation</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="project-desc">Description</label>
          <textarea
            id="project-desc"
            className="form-control"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write project description..."
            maxLength={1000}
          />
        </div>
        {status && (
          <div className={`upload-status ${status.type === "success" ? "upload-success" : "upload-error"}`}>
            {status.message}
          </div>
        )}
      </div>
    </>
  );
}

function projectForm(onClose, project = null) {
  const saveRef = { current: null };
  return {
    title: project ? "Edit Project" : "Add New Project",
    body: <ProjectFormContent onClose={onClose} onSaveRef={saveRef} project={project} />,
    onSave: () => saveRef.current?.()
  };
}

function DownloadFormContent({ onClose, onSaveRef, file }) {
  const [fileName, setFileName] = useState(file?.fileName || "");
  const [fileDesc, setFileDesc] = useState(file?.description || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async () => {
    if (saving) return;

    if (!fileName.trim()) {
      setStatus({ type: "error", message: "File name is required" });
      return;
    }
    if (!selectedFile) {
      setStatus({ type: "error", message: "Please select a PDF file" });
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();

      if (file) {
        // Edit: uses EditFileDto field names
        formData.append("NewFileName", fileName.trim());
        formData.append("NewDescription", fileDesc);
        formData.append("NewFile", selectedFile);

        const res = await fetch(`/api/File/${file.id}`, {
          method: "PUT",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData
        });

        const result = await res.json().catch(() => ({}));

        if (res.ok) {
          setStatus({ type: "success", message: result.message || "File updated!" });
          setTimeout(() => onClose(), 1500);
        } else {
          throw new Error(result.message || "Edit failed");
        }
      } else {
        // Create: uses UploadFileDto field names
        formData.append("FileName", fileName.trim());
        formData.append("Description", fileDesc);
        formData.append("File", selectedFile);

        const res = await fetch("/api/File", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData
        });

        const result = await res.json().catch(() => ({}));

        if (res.ok) {
          setStatus({ type: "success", message: result.message || "File uploaded!" });
          setTimeout(() => onClose(), 1500);
        } else {
          throw new Error(result.message || "Upload failed");
        }
      }
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  React.useEffect(() => {
    if (onSaveRef) onSaveRef.current = handleSubmit;
  });

  return (
    <>
      <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          hidden
        />
        {selectedFile ? (
          <div className="upload-file-info">
            <FilePlus size={32} />
            <span className="upload-file-name">{selectedFile.name}</span>
            <span className="upload-file-size">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</span>
          </div>
        ) : file?.filePath ? (
          <div className="upload-file-info">
            <FilePlus size={32} />
            <span className="upload-file-name">Current: {file.filePath.split("/").pop()}</span>
            <span className="upload-hint">Click to change file</span>
          </div>
        ) : (
          <div className="upload-placeholder">
            <Upload size={36} />
            <span>Click to select a PDF file</span>
            <span className="upload-hint">Max file size: 5 MB</span>
          </div>
        )}
      </div>
      <div className="upload-form-fields">
        <div className="form-group">
          <label htmlFor="download-name">File Name</label>
          <input
            id="download-name"
            className="form-control"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            maxLength={100}
          />
        </div>
        <div className="form-group">
          <label htmlFor="download-desc">Description (optional)</label>
          <textarea
            id="download-desc"
            className="form-control"
            rows="3"
            value={fileDesc}
            onChange={(e) => setFileDesc(e.target.value)}
            placeholder="Brief description of the file"
            maxLength={1000}
          />
        </div>
        {status && (
          <div className={`upload-status ${status.type === "success" ? "upload-success" : "upload-error"}`}>
            {status.message}
          </div>
        )}
      </div>
    </>
  );
}

function downloadForm(onClose, file = null) {
  const saveRef = { current: null };
  return {
    title: file ? "Edit File" : "Upload New File",
    body: <DownloadFormContent onClose={onClose} onSaveRef={saveRef} file={file} />,
    onSave: () => saveRef.current?.()
  };
}

function messageDetails(message) {
  return {
    title: "Message Details",
    body: (
      <div className="message-details">
        <div className="message-field"><strong>From:</strong> {message.fullName}</div>
        <div className="message-field"><strong>Email:</strong> {message.email}</div>
        <div className="message-field"><strong>Date:</strong> {new Date(message.sentAt).toLocaleDateString()}</div>
        <div className="message-content">{message.messageText}</div>
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
