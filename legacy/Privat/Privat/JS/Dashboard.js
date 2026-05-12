// ===== ADMIN PANEL JS =====
class AdminPanel {
  constructor() {
    this.API_BASE = 'http://localhost:3000/api'; // آدرس backend تو
    this.currentPage = 'dashboard';
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.loadPage('dashboard');
    this.fetchDashboardStats(); // آمار رو از backend بگیر
  }

  setupElements() {
    this.sidebar = document.querySelector('.admin-sidebar');
    this.menuToggle = document.querySelector('.menu-toggle');
    this.navItems = document.querySelectorAll('.nav-item[data-page]');
    this.pageTitle = document.getElementById('page-title');
    this.contentArea = document.getElementById('content-area');
    this.logoutBtn = document.querySelector('.logout-btn');
    this.modalContainer = document.getElementById('modal-container');
  }

  setupEventListeners() {
    // Mobile menu toggle
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.sidebar.classList.toggle('active');
      });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth < 992 && 
          this.sidebar && 
          !this.sidebar.contains(e.target) && 
          this.menuToggle && 
          !this.menuToggle.contains(e.target)) {
        this.sidebar.classList.remove('active');
      }
    });

    // Navigation items - DELEGATION PATTERN
    document.addEventListener('click', (e) => {
      const navItem = e.target.closest('.nav-item[data-page]');
      if (navItem) {
        e.preventDefault();
        this.handleNavigation(navItem);
      }
    });

    // Logout button
    if (this.logoutBtn) {
      this.logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
          this.handleLogout();
        }
      });
    }

    // Handle modal close clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('close-modal') || 
          e.target.closest('.close-modal') ||
          (e.target.classList.contains('form-modal') && e.target.id === 'messageModal')) {
        this.closeModal();
      }
    });
    
    // Handle form submissions
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'blog-form') {
        e.preventDefault();
        this.saveBlog();
      }
      if (e.target.id === 'project-form') {
        e.preventDefault();
        this.saveProject();
      }
      if (e.target.id === 'download-form') {
        e.preventDefault();
        this.saveDownload();
      }
      if (e.target.id === 'message-reply-form') {
        e.preventDefault();
        this.replyToMessage();
      }
    });
  }

  // ===== API HELPER =====
  async apiRequest(endpoint, method = 'GET', data = null) {
    try {
      const url = `${this.API_BASE}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      };
      
      const options = {
        method,
        headers
      };
      
      if (data) {
        options.body = JSON.stringify(data);
      }
      
      const response = await fetch(url, options);
      
      if (response.status === 401) {
        this.handleLogout();
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      this.showNotification('Error connecting to server', 'error');
      return null;
    }
  }

  // ===== DASHBOARD =====
  async fetchDashboardStats() {
    try {
      const stats = await this.apiRequest('/admin/stats');
      if (stats) {
        this.updateDashboardStats(stats);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  }

  updateDashboardStats(stats) {
    // آپدیت کردن مقادیر داشبورد
    const blogCount = document.querySelector('.stat-card:nth-child(1) .stat-number');
    const projectCount = document.querySelector('.stat-card:nth-child(2) .stat-number');
    const downloadCount = document.querySelector('.stat-card:nth-child(3) .stat-number');
    const messageCount = document.querySelector('.stat-card:nth-child(4) .stat-number');
    
    if (blogCount) blogCount.textContent = stats.totalBlogs || 0;
    if (projectCount) projectCount.textContent = stats.totalProjects || 0;
    if (downloadCount) downloadCount.textContent = stats.totalDownloads || 0;
    if (messageCount) messageCount.textContent = stats.newMessages || 0;
  }

  // ===== NAVIGATION =====
  handleNavigation(navItem) {
    const page = navItem.dataset.page;
    
    // Update active state
    this.navItems.forEach(nav => nav.classList.remove('active'));
    navItem.classList.add('active');
    
    // Load the page
    this.loadPage(page);
    
    // Close sidebar on mobile
    if (window.innerWidth < 992 && this.sidebar) {
      this.sidebar.classList.remove('active');
    }
  }

  handleLogout() {
    localStorage.removeItem('admin_token');
    window.location.href = '/login.html';
  }

  loadPage(page) {
    this.currentPage = page;
    
    // Update page title
    const titles = {
      dashboard: 'Dashboard',
      blogs: 'Blog Management',
      projects: 'Project Management',
      downloads: 'Download Management',
      messages: 'Messages',
      settings: 'Settings'
    };
    
    if (this.pageTitle) {
      this.pageTitle.textContent = titles[page] || 'Admin Panel';
    }
    
    // Show loading spinner
    if (this.contentArea) {
      this.contentArea.innerHTML = '<div class="spinner"></div>';
    }
    
    // Load page content
    setTimeout(() => {
      switch(page) {
        case 'dashboard':
          this.renderDashboard();
          break;
        case 'blogs':
          this.renderBlogs();
          break;
        case 'projects':
          this.renderProjects();
          break;
        case 'downloads':
          this.renderDownloads();
          break;
        case 'messages':
          this.renderMessages();
          break;
        case 'settings':
          this.renderSettings();
          break;
        default:
          this.renderDashboard();
      }
    }, 300);
  }

  // ===== PAGE RENDERERS =====
  renderDashboard() {
    const html = `
      <div class="dashboard-grid">
        <div class="stat-card">
          <div class="stat-icon icon-blog">
            <i class="fas fa-blog"></i>
          </div>
          <div class="stat-info">
            <h3>Total Blogs</h3>
            <div class="stat-number">0</div>
            <div class="stat-change">Loading...</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon icon-project">
            <i class="fas fa-project-diagram"></i>
          </div>
          <div class="stat-info">
            <h3>Active Projects</h3>
            <div class="stat-number">0</div>
            <div class="stat-change">Loading...</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon icon-download">
            <i class="fas fa-download"></i>
          </div>
          <div class="stat-info">
            <h3>Total Downloads</h3>
            <div class="stat-number">0</div>
            <div class="stat-change">Loading...</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon icon-message">
            <i class="fas fa-envelope"></i>
          </div>
          <div class="stat-info">
            <h3>New Messages</h3>
            <div class="stat-number">0</div>
            <div class="stat-change">Need reply</div>
          </div>
        </div>
      </div>
      
      <div class="admin-table-container">
        <div class="table-header">
          <h3 class="table-title">Quick Actions</h3>
        </div>
        <div class="quick-actions">
          <button class="quick-action-btn" onclick="adminPanel.loadPage('blogs')">
            <i class="fas fa-plus"></i> Add New Blog
          </button>
          <button class="quick-action-btn" onclick="adminPanel.loadPage('projects')">
            <i class="fas fa-plus"></i> Add New Project
          </button>
          <button class="quick-action-btn" onclick="adminPanel.loadPage('downloads')">
            <i class="fas fa-plus"></i> Add New Download
          </button>
          <button class="quick-action-btn" onclick="adminPanel.loadPage('messages')">
            <i class="fas fa-eye"></i> View Messages
          </button>
        </div>
      </div>
    `;
    
    this.contentArea.innerHTML = html;
    this.fetchDashboardStats(); // آمار رو بگیر
  }

  // ===== BLOGS MANAGEMENT =====
  async renderBlogs() {
    try {
      const blogs = await this.apiRequest('/blogs');
      
      const html = `
        <div class="admin-table-container">
          <div class="table-header">
            <h3 class="table-title">Blog Posts</h3>
            <button class="btn-add" id="addBlogBtn">
              <i class="fas fa-plus"></i> Add New Post
            </button>
          </div>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="blogs-table-body">
              ${blogs && blogs.length > 0 ? 
                blogs.map(blog => `
                  <tr>
                    <td>${blog.title}</td>
                    <td>${blog.category}</td>
                    <td>${new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div class="table-actions">
                        <button class="btn-action btn-edit" onclick="adminPanel.openBlogForm('${blog._id}')">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="adminPanel.deleteBlog('${blog._id}')">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('') : 
                '<tr><td colspan="4" class="text-center">No blogs found</td></tr>'
              }
            </tbody>
          </table>
        </div>
      `;
      
      this.contentArea.innerHTML = html;
      
      // Add event listener for add button
      document.getElementById('addBlogBtn').addEventListener('click', () => {
        this.openBlogForm();
      });
      
    } catch (error) {
      this.contentArea.innerHTML = '<p class="error">Error loading blogs</p>';
    }
  }

  // ===== BLOG FORM =====
  async openBlogForm(blogId = null) {
    let blogData = null;
    
    if (blogId) {
      blogData = await this.apiRequest(`/blogs/${blogId}`);
    }
    
    const modalHtml = `
      <div class="form-modal active">
        <div class="form-content">
          <div class="form-header">
            <h3>${blogId ? 'Edit Blog Post' : 'Add New Blog Post'}</h3>
            <button class="close-modal">&times;</button>
          </div>
          <div class="form-body">
            <form id="blog-form">
              <input type="hidden" id="blog-id" value="${blogId || ''}">
              <div class="form-group">
                <label for="blog-title">Title *</label>
                <input type="text" id="blog-title" class="form-control" 
                  value="${blogData ? blogData.title : ''}" required>
              </div>
              <div class="form-group">
                <label for="blog-category">Category *</label>
                <select id="blog-category" class="form-control" required>
                  <option value="">Select Category</option>
                  <option value="sustainability" ${blogData && blogData.category === 'sustainability' ? 'selected' : ''}>Sustainability</option>
                  <option value="structural" ${blogData && blogData.category === 'structural' ? 'selected' : ''}>Structural</option>
                  <option value="environmental" ${blogData && blogData.category === 'environmental' ? 'selected' : ''}>Environmental</option>
                  <option value="technology" ${blogData && blogData.category === 'technology' ? 'selected' : ''}>Technology</option>
                </select>
              </div>
              <div class="form-group">
                <label for="blog-description">Description *</label>
                <textarea id="blog-description" class="form-control" rows="6" required>${blogData ? blogData.description : ''}</textarea>
              </div>
              <div class="form-group">
                <label for="blog-image">Image URL</label>
                <input type="text" id="blog-image" class="form-control" 
                  value="${blogData ? blogData.imageUrl : ''}" 
                  placeholder="https://example.com/image.jpg">
              </div>
            </form>
          </div>
          <div class="form-footer">
            <button type="button" class="btn btn-secondary close-modal">Cancel</button>
            <button type="submit" form="blog-form" class="btn btn-primary">${blogId ? 'Update' : 'Save'} Post</button>
          </div>
        </div>
      </div>
    `;
    
    this.modalContainer.innerHTML = modalHtml;
  }

  async saveBlog() {
    const blogId = document.getElementById('blog-id')?.value;
    const blogData = {
      title: document.getElementById('blog-title').value,
      category: document.getElementById('blog-category').value,
      description: document.getElementById('blog-description').value,
      imageUrl: document.getElementById('blog-image').value
    };
    
    try {
      const endpoint = blogId ? `/blogs/${blogId}` : '/blogs';
      const method = blogId ? 'PUT' : 'POST';
      
      const result = await this.apiRequest(endpoint, method, blogData);
      if (result) {
        this.closeModal();
        this.showNotification(`Blog ${blogId ? 'updated' : 'created'} successfully`, 'success');
        this.renderBlogs();
      }
    } catch (error) {
      this.showNotification('Error saving blog', 'error');
    }
  }

  async deleteBlog(blogId) {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      const result = await this.apiRequest(`/blogs/${blogId}`, 'DELETE');
      if (result) {
        this.showNotification('Blog deleted successfully', 'success');
        this.renderBlogs();
      }
    } catch (error) {
      this.showNotification('Error deleting blog', 'error');
    }
  }

  // ===== PROJECTS MANAGEMENT =====
  async renderProjects() {
    try {
      const projects = await this.apiRequest('/projects');
      
      const html = `
        <div class="admin-table-container">
          <div class="table-header">
            <h3 class="table-title">Projects</h3>
            <button class="btn-add" id="addProjectBtn">
              <i class="fas fa-plus"></i> Add New Project
            </button>
          </div>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="projects-table-body">
              ${projects && projects.length > 0 ? 
                projects.map(project => `
                  <tr>
                    <td>${project.title}</td>
                    <td>${project.category}</td>
                    <td>${project.location}</td>
                    <td>${project.year}</td>
                    <td>
                      <div class="table-actions">
                        <button class="btn-action btn-edit" onclick="adminPanel.openProjectForm('${project._id}')">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="adminPanel.deleteProject('${project._id}')">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('') : 
                '<tr><td colspan="5" class="text-center">No projects found</td></tr>'
              }
            </tbody>
          </table>
        </div>
      `;
      
      this.contentArea.innerHTML = html;
      
      document.getElementById('addProjectBtn').addEventListener('click', () => {
        this.openProjectForm();
      });
      
    } catch (error) {
      this.contentArea.innerHTML = '<p class="error">Error loading projects</p>';
    }
  }

  async openProjectForm(projectId = null) {
    let projectData = null;
    
    if (projectId) {
      projectData = await this.apiRequest(`/projects/${projectId}`);
    }
    
    const modalHtml = `
      <div class="form-modal active">
        <div class="form-content">
          <div class="form-header">
            <h3>${projectId ? 'Edit Project' : 'Add New Project'}</h3>
            <button class="close-modal">&times;</button>
          </div>
          <div class="form-body">
            <form id="project-form">
              <input type="hidden" id="project-id" value="${projectId || ''}">
              <div class="form-group">
                <label for="project-title">Title *</label>
                <input type="text" id="project-title" class="form-control" 
                  value="${projectData ? projectData.title : ''}" required>
              </div>
              <div class="form-group">
                <label for="project-category">Category *</label>
                <select id="project-category" class="form-control" required>
                  <option value="">Select Category</option>
                  <option value="infrastructure" ${projectData && projectData.category === 'infrastructure' ? 'selected' : ''}>Infrastructure</option>
                  <option value="structural" ${projectData && projectData.category === 'structural' ? 'selected' : ''}>Structural</option>
                  <option value="environmental" ${projectData && projectData.category === 'environmental' ? 'selected' : ''}>Environmental</option>
                  <option value="transportation" ${projectData && projectData.category === 'transportation' ? 'selected' : ''}>Transportation</option>
                </select>
              </div>
              <div class="form-group">
                <label for="project-location">Location *</label>
                <input type="text" id="project-location" class="form-control" 
                  value="${projectData ? projectData.location : ''}" required>
              </div>
              <div class="form-group">
                <label for="project-year">Year *</label>
                <input type="number" id="project-year" class="form-control" 
                  value="${projectData ? projectData.year : new Date().getFullYear()}" 
                  min="2000" max="2030" required>
              </div>
              <div class="form-group">
                <label for="project-description">Description</label>
                <textarea id="project-description" class="form-control" rows="4">${projectData ? projectData.description : ''}</textarea>
              </div>
              <div class="form-group">
                <label for="project-image">Image URL</label>
                <input type="text" id="project-image" class="form-control" 
                  value="${projectData ? projectData.imageUrl : ''}">
              </div>
            </form>
          </div>
          <div class="form-footer">
            <button type="button" class="btn btn-secondary close-modal">Cancel</button>
            <button type="submit" form="project-form" class="btn btn-primary">${projectId ? 'Update' : 'Save'} Project</button>
          </div>
        </div>
      </div>
    `;
    
    this.modalContainer.innerHTML = modalHtml;
  }

  async saveProject() {
    const projectId = document.getElementById('project-id')?.value;
    const projectData = {
      title: document.getElementById('project-title').value,
      category: document.getElementById('project-category').value,
      location: document.getElementById('project-location').value,
      year: document.getElementById('project-year').value,
      description: document.getElementById('project-description').value,
      imageUrl: document.getElementById('project-image').value
    };
    
    try {
      const endpoint = projectId ? `/projects/${projectId}` : '/projects';
      const method = projectId ? 'PUT' : 'POST';
      
      const result = await this.apiRequest(endpoint, method, projectData);
      if (result) {
        this.closeModal();
        this.showNotification(`Project ${projectId ? 'updated' : 'created'} successfully`, 'success');
        this.renderProjects();
      }
    } catch (error) {
      this.showNotification('Error saving project', 'error');
    }
  }

  async deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const result = await this.apiRequest(`/projects/${projectId}`, 'DELETE');
      if (result) {
        this.showNotification('Project deleted successfully', 'success');
        this.renderProjects();
      }
    } catch (error) {
      this.showNotification('Error deleting project', 'error');
    }
  }

  // ===== DOWNLOADS MANAGEMENT =====
  async renderDownloads() {
    try {
      const downloads = await this.apiRequest('/downloads');
      
      const html = `
        <div class="admin-table-container">
          <div class="table-header">
            <h3 class="table-title">Downloadable Files</h3>
            <button class="btn-add" id="addDownloadBtn">
              <i class="fas fa-plus"></i> Add New File
            </button>
          </div>
          <table class="admin-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Size</th>
                <th>Downloads</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="downloads-table-body">
              ${downloads && downloads.length > 0 ? 
                downloads.map(download => `
                  <tr>
                    <td>${download.name}</td>
                    <td>${download.description}</td>
                    <td>${download.category}</td>
                    <td>${download.size}</td>
                    <td>${download.downloadCount || 0}</td>
                    <td>
                      <div class="table-actions">
                        <button class="btn-action btn-edit" onclick="adminPanel.openDownloadForm('${download._id}')">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="adminPanel.deleteDownload('${download._id}')">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('') : 
                '<tr><td colspan="6" class="text-center">No downloads found</td></tr>'
              }
            </tbody>
          </table>
        </div>
      `;
      
      this.contentArea.innerHTML = html;
      
      document.getElementById('addDownloadBtn').addEventListener('click', () => {
        this.openDownloadForm();
      });
      
    } catch (error) {
      this.contentArea.innerHTML = '<p class="error">Error loading downloads</p>';
    }
  }

  async openDownloadForm(downloadId = null) {
    let downloadData = null;
    
    if (downloadId) {
      downloadData = await this.apiRequest(`/downloads/${downloadId}`);
    }
    
    const modalHtml = `
      <div class="form-modal active">
        <div class="form-content">
          <div class="form-header">
            <h3>${downloadId ? 'Edit Download' : 'Add New Download'}</h3>
            <button class="close-modal">&times;</button>
          </div>
          <div class="form-body">
            <form id="download-form">
              <input type="hidden" id="download-id" value="${downloadId || ''}">
              <div class="form-group">
                <label for="download-name">File Name *</label>
                <input type="text" id="download-name" class="form-control" 
                  value="${downloadData ? downloadData.name : ''}" required>
              </div>
              <div class="form-group">
                <label for="download-description">Description *</label>
                <textarea id="download-description" class="form-control" rows="3" required>${downloadData ? downloadData.description : ''}</textarea>
              </div>
              <div class="form-group">
                <label for="download-category">Category *</label>
                <select id="download-category" class="form-control" required>
                  <option value="">Select Category</option>
                  <option value="brochure" ${downloadData && downloadData.category === 'brochure' ? 'selected' : ''}>Brochure</option>
                  <option value="technical" ${downloadData && downloadData.category === 'technical' ? 'selected' : ''}>Technical Specs</option>
                  <option value="case-study" ${downloadData && downloadData.category === 'case-study' ? 'selected' : ''}>Case Study</option>
                  <option value="report" ${downloadData && downloadData.category === 'report' ? 'selected' : ''}>Report</option>
                  <option value="guide" ${downloadData && downloadData.category === 'guide' ? 'selected' : ''}>Guide</option>
                </select>
              </div>
              <div class="form-group">
                <label for="download-file-url">File URL *</label>
                <input type="url" id="download-file-url" class="form-control" 
                  value="${downloadData ? downloadData.fileUrl : ''}" required>
              </div>
              <div class="form-group">
                <label for="download-size">File Size (MB)</label>
                <input type="number" id="download-size" class="form-control" step="0.1"
                  value="${downloadData ? downloadData.size : ''}">
              </div>
            </form>
          </div>
          <div class="form-footer">
            <button type="button" class="btn btn-secondary close-modal">Cancel</button>
            <button type="submit" form="download-form" class="btn btn-primary">${downloadId ? 'Update' : 'Save'} File</button>
          </div>
        </div>
      </div>
    `;
    
    this.modalContainer.innerHTML = modalHtml;
  }

  async saveDownload() {
    const downloadId = document.getElementById('download-id')?.value;
    const downloadData = {
      name: document.getElementById('download-name').value,
      description: document.getElementById('download-description').value,
      category: document.getElementById('download-category').value,
      fileUrl: document.getElementById('download-file-url').value,
      size: document.getElementById('download-size').value + ' MB'
    };
    
    try {
      const endpoint = downloadId ? `/downloads/${downloadId}` : '/downloads';
      const method = downloadId ? 'PUT' : 'POST';
      
      const result = await this.apiRequest(endpoint, method, downloadData);
      if (result) {
        this.closeModal();
        this.showNotification(`Download ${downloadId ? 'updated' : 'created'} successfully`, 'success');
        this.renderDownloads();
      }
    } catch (error) {
      this.showNotification('Error saving download', 'error');
    }
  }

  async deleteDownload(downloadId) {
    if (!confirm('Are you sure you want to delete this download?')) return;
    
    try {
      const result = await this.apiRequest(`/downloads/${downloadId}`, 'DELETE');
      if (result) {
        this.showNotification('Download deleted successfully', 'success');
        this.renderDownloads();
      }
    } catch (error) {
      this.showNotification('Error deleting download', 'error');
    }
  }

  // ===== MESSAGES MANAGEMENT =====
  async renderMessages() {
    try {
      const messages = await this.apiRequest('/messages');
      
      const html = `
        <div class="admin-table-container">
          <div class="table-header">
            <h3 class="table-title">Contact Messages</h3>
          </div>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message Preview</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="messages-table-body">
              ${messages && messages.length > 0 ? 
                messages.map(message => `
                  <tr>
                    <td>${message.name}</td>
                    <td>${message.email}</td>
                    <td>${message.message.substring(0, 50)}...</td>
                    <td>${new Date(message.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span class="status-badge ${message.status === 'new' ? 'status-pending' : 'status-published'}">
                        ${message.status}
                      </span>
                    </td>
                    <td>
                      <div class="table-actions">
                        <button class="btn-action btn-view" onclick="adminPanel.viewMessage('${message._id}')">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" onclick="adminPanel.openMessageReply('${message._id}')">
                          <i class="fas fa-reply"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="adminPanel.deleteMessage('${message._id}')">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('') : 
                '<tr><td colspan="6" class="text-center">No messages found</td></tr>'
              }
            </tbody>
          </table>
        </div>
      `;
      
      this.contentArea.innerHTML = html;
      
    } catch (error) {
      this.contentArea.innerHTML = '<p class="error">Error loading messages</p>';
    }
  }

  async viewMessage(messageId) {
    try {
      const message = await this.apiRequest(`/messages/${messageId}`);
      
      const modalHtml = `
        <div class="form-modal active" id="messageModal">
          <div class="form-content" style="max-width: 700px;">
            <div class="form-header">
              <h3>Message Details</h3>
              <button class="close-modal">&times;</button>
            </div>
            <div class="form-body">
              <div class="message-details">
                <div class="message-field">
                  <strong>From:</strong> ${message.name}
                </div>
                <div class="message-field">
                  <strong>Email:</strong> ${message.email}
                </div>
                <div class="message-field">
                  <strong>Date:</strong> ${new Date(message.createdAt).toLocaleString()}
                </div>
                <div class="message-field">
                  <strong>Status:</strong> 
                  <span class="status-badge ${message.status === 'new' ? 'status-pending' : 'status-published'}">
                    ${message.status}
                  </span>
                </div>
                <div class="message-field">
                  <strong>Subject:</strong> ${message.subject || 'No Subject'}
                </div>
                <div class="message-field">
                  <strong>Message:</strong>
                  <div class="message-content">${message.message}</div>
                </div>
              </div>
            </div>
            <div class="form-footer">
              <button type="button" class="btn btn-secondary close-modal">Close</button>
              <button type="button" class="btn btn-primary" onclick="adminPanel.openMessageReply('${messageId}')">
                <i class="fas fa-reply"></i> Reply
              </button>
            </div>
          </div>
        </div>
      `;
      
      this.modalContainer.innerHTML = modalHtml;
      
      // Mark as read
      if (message.status === 'new') {
        await this.apiRequest(`/messages/${messageId}/read`, 'PUT');
        this.renderMessages(); // Refresh messages list
      }
      
    } catch (error) {
      this.showNotification('Error loading message', 'error');
    }
  }

  async openMessageReply(messageId) {
    try {
      const message = await this.apiRequest(`/messages/${messageId}`);
      
      const modalHtml = `
        <div class="form-modal active">
          <div class="form-content">
            <div class="form-header">
              <h3>Reply to ${message.name}</h3>
              <button class="close-modal">&times;</button>
            </div>
            <div class="form-body">
              <form id="message-reply-form">
                <input type="hidden" id="message-id" value="${messageId}">
                <div class="form-group">
                  <label>Original Message:</label>
                  <div class="original-message">${message.message}</div>
                </div>
                <div class="form-group">
                  <label for="reply-subject">Subject *</label>
                  <input type="text" id="reply-subject" class="form-control" 
                    value="Re: ${message.subject || 'Your Message'}" required>
                </div>
                <div class="form-group">
                  <label for="reply-message">Your Reply *</label>
                  <textarea id="reply-message" class="form-control" rows="6" required></textarea>
                </div>
              </form>
            </div>
            <div class="form-footer">
              <button type="button" class="btn btn-secondary close-modal">Cancel</button>
              <button type="submit" form="message-reply-form" class="btn btn-primary">Send Reply</button>
            </div>
          </div>
        </div>
      `;
      
      this.modalContainer.innerHTML = modalHtml;
      
    } catch (error) {
      this.showNotification('Error loading message', 'error');
    }
  }

  async replyToMessage() {
    const messageId = document.getElementById('message-id')?.value;
    const replyData = {
      subject: document.getElementById('reply-subject').value,
      message: document.getElementById('reply-message').value
    };
    
    try {
      const result = await this.apiRequest(`/messages/${messageId}/reply`, 'POST', replyData);
      if (result) {
        this.closeModal();
        this.showNotification('Reply sent successfully', 'success');
        this.renderMessages();
      }
    } catch (error) {
      this.showNotification('Error sending reply', 'error');
    }
  }

  async deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const result = await this.apiRequest(`/messages/${messageId}`, 'DELETE');
      if (result) {
        this.showNotification('Message deleted successfully', 'success');
        this.renderMessages();
      }
    } catch (error) {
      this.showNotification('Error deleting message', 'error');
    }
  }

  // ===== SETTINGS =====
  renderSettings() {
    const html = `
      <div class="admin-table-container">
        <div class="table-header">
          <h3 class="table-title">Site Settings</h3>
        </div>
        <div class="form-body">
          <form id="settings-form">
            <div class="form-group">
              <label for="site-name">Site Name</label>
              <input type="text" id="site-name" class="form-control" value="Precision Engineering Solutions">
            </div>
            <div class="form-group">
              <label for="site-description">Site Description</label>
              <textarea id="site-description" class="form-control" rows="3">Leading consulting engineering firm...</textarea>
            </div>
            <div class="form-footer">
              <button type="button" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Settings</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    this.contentArea.innerHTML = html;
  }

  // ===== UTILITY METHODS =====
  closeModal() {
    this.modalContainer.innerHTML = '';
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? '#00b894' : type === 'error' ? '#ff4757' : '#0078d4'};
      color: white;
      border-radius: 5px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 300px;
      animation: slideIn 0.3s ease;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .notification-content { display: flex; align-items: center; gap: 10px; }
      .notification-close { background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; }
    `;
    document.head.appendChild(style);
    
    // Add close button listener
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.adminPanel = new AdminPanel();
});