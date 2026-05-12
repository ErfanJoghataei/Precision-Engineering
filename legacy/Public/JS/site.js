// main.js - Frontend JavaScript with Smart Filtering System

const API_BASE_URL = 'https://localhost:7037/api';
const USE_API = true;
const API_TIMEOUT = 3000;

// ===== STATIC FALLBACK DATA =====
const STATIC_PROJECTS = [
    {
        id: 1,
        title: "Metropolitan Bridge Expansion",
        category: "infrastructure",
        description: "Complete structural redesign and expansion of a major urban bridge system serving 100,000+ daily commuters.",
        imageUrl: "/placeholder.svg?height=350&width=500"
    },
    {
        id: 2,
        title: "Downtown Corporate Tower",
        category: "structural",
        description: "45-story mixed-use development featuring innovative seismic design and sustainable building practices.",
        imageUrl: "/placeholder.svg?height=350&width=500"
    },
    {
        id: 3,
        title: "Regional Water Treatment Facility",
        category: "environmental",
        description: "State-of-the-art facility processing 50 million gallons daily with advanced filtration technology.",
        imageUrl: "/placeholder.svg?height=350&width=500"
    },
    {
        id: 4,
        title: "Interstate Highway Interchange",
        category: "transportation",
        description: "Complex multi-level interchange design improving traffic flow and reducing congestion by 40%.",
        imageUrl: "/placeholder.svg?height=350&width=500"
    },
    {
        id: 5,
        title: "Sports Arena Complex",
        category: "structural",
        description: "65,000-seat stadium with retractable roof featuring cutting-edge structural engineering solutions.",
        imageUrl: "/placeholder.svg?height=350&width=500"
    },
    {
        id: 6,
        title: "Solar Energy Installation",
        category: "environmental",
        description: "200-acre solar farm generating clean energy for 15,000 homes with minimal environmental impact.",
        imageUrl: "/placeholder.svg?height=350&width=500"
    }
];

// ===== PROJECTS SECTION =====

/**
 * Load and display projects (API or Static)
 */
async function loadProjects() {
    try {
        let projects = [];
        
        if (USE_API) {
            // Try to get from API
            projects = await fetchWithTimeout('/Projects', API_TIMEOUT);
            
            if (!projects || projects.length === 0) {
                console.log('API returned no projects, using static data');
                projects = STATIC_PROJECTS;
            }
        } else {
            // Use static data directly
            projects = STATIC_PROJECTS;
        }
        
        displayProjects(projects);
        setupProjectFilters(projects);
        
    } catch (error) {
        console.log('Using static project data due to error:', error.message);
        displayProjects(STATIC_PROJECTS);
        setupProjectFilters(STATIC_PROJECTS);
    }
}

/**
 * Display projects in the grid
 */
function displayProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = projects.map(project => `
        <article class="project-card" data-category="${project.category.toLowerCase()}">
            <div class="project-image" style="background-image: url('${project.imageUrl || '/placeholder.svg?height=350&width=500'}');"></div>
            <div class="project-overlay">
                <span class="project-category">${formatCategory(project.category)}</span>
                <h3>${escapeHtml(project.title)}</h3>
                <p>${escapeHtml(project.description.substring(0, 100))}${project.description.length > 100 ? '...' : ''}</p>
            </div>
        </article>
    `).join('');
    
    console.log(`Displayed ${projects.length} projects`);
}

/**
 * Setup project filters with dynamic categories
 */
function setupProjectFilters(projects) {
    const filterBar = document.querySelector('.filter-bar');
    if (!filterBar) return;
    
    // Extract unique categories from projects
    const categories = ['all'];
    projects.forEach(project => {
        const category = project.category.toLowerCase();
        if (category && !categories.includes(category)) {
            categories.push(category);
        }
    });
    
    // Create filter buttons
    filterBar.innerHTML = categories.map(category => `
        <button class="filter-btn ${category === 'all' ? 'active' : ''}" 
                data-filter="${category}">
            ${getCategoryDisplayName(category)}
        </button>
    `).join('');
    
    // Add event listeners
    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleFilterClick(this);
        });
    });
    
    console.log('Project filters setup with categories:', categories);
}

/**
 * Handle filter button click
 */
function handleFilterClick(button) {
    // Remove active class from all buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active to clicked button
    button.classList.add('active');
    
    const filterValue = button.dataset.filter;
    filterProjectsByCategory(filterValue);
}

/**
 * Filter projects by category
 */
function filterProjectsByCategory(category) {
    const projectCards = document.querySelectorAll('.project-card');
    let visibleCount = 0;
    
    projectCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            visibleCount++;
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    console.log(`Filter: ${category}, Showing: ${visibleCount} projects`);
    
    // If no projects visible, show message
    if (visibleCount === 0) {
        showNoProjectsMessage(category);
    } else {
        hideNoProjectsMessage();
    }
}

/**
 * Show message when no projects in category
 */
function showNoProjectsMessage(category) {
    let message = document.querySelector('.no-projects-message');
    
    if (!message) {
        message = document.createElement('div');
        message.className = 'no-projects-message';
        message.style.cssText = `
            text-align: center;
            padding: 40px;
            grid-column: 1 / -1;
            color: #666;
            font-size: 1.1rem;
        `;
        document.querySelector('.projects-grid').appendChild(message);
    }
    
    const displayName = getCategoryDisplayName(category);
    message.innerHTML = `
        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; color: #0078d4;"></i>
        <h3>No ${displayName === 'All Projects' ? '' : displayName + ' '}Projects Found</h3>
        <p>Try selecting a different category or check back later for new projects.</p>
    `;
}

/**
 * Hide no projects message
 */
function hideNoProjectsMessage() {
    const message = document.querySelector('.no-projects-message');
    if (message) {
        message.remove();
    }
}

/**
 * Get display name for category
 */
function getCategoryDisplayName(category) {
    const names = {
        'all': 'All Projects',
        'infrastructure': 'Infrastructure',
        'structural': 'Structural',
        'environmental': 'Environmental',
        'transportation': 'Transportation',
        'sustainability': 'Sustainability',
        'technology': 'Technology'
    };
    
    return names[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

// ===== HELPER FUNCTIONS =====

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(endpoint, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(API_BASE_URL + endpoint, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('API request timeout');
        }
        throw error;
    }
}

/**
 * Format category name
 */
function formatCategory(category) {
    if (!category) return 'General';
    return category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
}

// ===== INITIALIZATION =====

/**
 * Initialize website
 */
async function initializeWebsite() {
    console.log('Initializing website...');
    
    // Load projects
    await loadProjects();
    
    // Add filter styles
    addFilterStyles();
    
    console.log('Website initialized successfully');
}

/**
 * Add filter animation styles
 */
function addFilterStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Project filter animations */
        .project-card {
            transition: all 0.3s ease;
        }
        
        .filter-btn {
            transition: all 0.2s ease;
            cursor: pointer;
        }
        
        .filter-btn:hover {
            transform: translateY(-2px);
        }
        
        .filter-btn.active {
            background-color: #0078d4;
            color: white;
            border-color: #0078d4;
        }
        
        /* Grid animations */
        .projects-grid {
            display: grid;
            gap: 20px;
            transition: all 0.3s ease;
        }
        
        @media (min-width: 768px) {
            .projects-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (min-width: 1024px) {
            .projects-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }
        
        /* Loading animation */
        .projects-loading {
            opacity: 0.6;
            pointer-events: none;
        }
        
        .filter-bar {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            margin-bottom: 30px;
        }
    `;
    document.head.appendChild(style);
}

// ===== PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    initializeWebsite();
});

// ===== GLOBAL EXPORTS =====
window.filterProjectsByCategory = filterProjectsByCategory;