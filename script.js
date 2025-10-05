// Global state
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
const postsPerPage = 10;
let activeFilters = new Set();
let baseUrl = '';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeBaseUrl();
    initializeTheme();
    initializeNavigation();
    loadPosts();
});

// Set base URL for GitHub Pages compatibility
function initializeBaseUrl() {
    // Check if we're on GitHub Pages
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // Extract repository name from path for GitHub Pages
        const pathSegments = window.location.pathname.split('/');
        if (pathSegments.length > 1) {
            baseUrl = '/' + pathSegments[1];
        }
    }
    console.log('Base URL set to:', baseUrl || '/');
}

// Theme management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Navigation
function initializeNavigation() {
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Post loading and management
async function loadPosts() {
    try {
        const postsIndexPath = `${baseUrl}/posts/index.json`;
        console.log('Loading posts from:', postsIndexPath);
        
        const response = await fetch(postsIndexPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const posts = await response.json();
        
        // Update post paths to include baseUrl
        allPosts = posts.map(post => ({
            ...post,
            path: `${baseUrl}/${post.path}`
        })).sort((a, b) => new Date(b.date) - new Date(a.date));
        
        filteredPosts = [...allPosts];
        
        // Initialize page-specific functionality
        const currentPage = getCurrentPage();
        
        switch (currentPage) {
            case 'index':
                displayLatestPosts();
                break;
            case 'archive':
                initializeArchive();
                break;
            case 'post':
                loadSinglePost();
                break;
        }
        
    } catch (error) {
        console.error('Error loading posts:', error);
        showError('Failed to load posts. Please check that posts/index.json exists and is valid.');
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('archive.html')) return 'archive';
    if (path.includes('post.html')) return 'post';
    return 'index';
}

// Homepage functionality
function displayLatestPosts() {
    const container = document.getElementById('latestPosts');
    if (!container) return;
    
    const latestPosts = allPosts.slice(0, 3);
    
    if (latestPosts.length === 0) {
        container.innerHTML = '<p class="no-results">No posts available yet.</p>';
        return;
    }
    
    container.innerHTML = latestPosts.map(post => createPostCard(post)).join('');
}

function createPostCard(post) {
    const formattedDate = formatDate(post.date);
    const tagsHtml = post.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
    
    return `
        <article class="post-card">
            <h3 class="post-card-title">
                <a href="post.html?slug=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a>
            </h3>
            <div class="post-card-meta">
                <time class="post-date">${formattedDate}</time>
            </div>
            <p class="post-card-excerpt">${escapeHtml(post.excerpt)}</p>
            <div class="post-card-tags">${tagsHtml}</div>
            <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="btn btn-primary">Read More</a>
        </article>
    `;
}

// Archive page functionality
function initializeArchive() {
    setupSearch();
    setupTagFilters();
    displayArchivePosts();
    setupLoadMore();
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(handleSearch, 300));
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    
    if (query === '') {
        filteredPosts = [...allPosts];
    } else {
        filteredPosts = allPosts.filter(post => {
            return post.title.toLowerCase().includes(query) ||
                   post.excerpt.toLowerCase().includes(query) ||
                   post.tags.some(tag => tag.toLowerCase().includes(query));
        });
    }
    
    applyTagFilters();
    currentPage = 1;
    displayArchivePosts();
}

function setupTagFilters() {
    const filterContainer = document.getElementById('filterTags');
    if (!filterContainer) return;
    
    // Get all unique tags
    const allTags = [...new Set(allPosts.flatMap(post => post.tags))].sort();
    
    filterContainer.innerHTML = allTags.map(tag => 
        `<button class="tag filter-tag" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`
    ).join('');
    
    // Add event listeners
    filterContainer.addEventListener('click', handleTagFilter);
}

function handleTagFilter(event) {
    if (!event.target.classList.contains('filter-tag')) return;
    
    const tag = event.target.dataset.tag;
    
    if (activeFilters.has(tag)) {
        activeFilters.delete(tag);
        event.target.classList.remove('active');
    } else {
        activeFilters.add(tag);
        event.target.classList.add('active');
    }
    
    applyTagFilters();
    currentPage = 1;
    displayArchivePosts();
}

function applyTagFilters() {
    if (activeFilters.size === 0) return;
    
    filteredPosts = filteredPosts.filter(post => 
        [...activeFilters].every(tag => post.tags.includes(tag))
    );
}

function displayArchivePosts() {
    const container = document.getElementById('archivePosts');
    const noResults = document.getElementById('noResults');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    
    if (!container) return;
    
    if (filteredPosts.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        loadMoreContainer.style.display = 'none';
        return;
    }
    
    noResults.style.display = 'none';
    
    const startIndex = 0;
    const endIndex = currentPage * postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);
    
    container.innerHTML = postsToShow.map(post => createPostListItem(post)).join('');
    
    // Show/hide load more button
    if (endIndex >= filteredPosts.length) {
        loadMoreContainer.style.display = 'none';
    } else {
        loadMoreContainer.style.display = 'block';
    }
}

function createPostListItem(post) {
    const formattedDate = formatDate(post.date);
    const tagsHtml = post.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
    
    return `
        <article class="post-list-item">
            <h3 class="post-card-title">
                <a href="post.html?slug=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a>
            </h3>
            <div class="post-card-meta">
                <time class="post-date">${formattedDate}</time>
            </div>
            <p class="post-card-excerpt">${escapeHtml(post.excerpt)}</p>
            <div class="post-card-tags">${tagsHtml}</div>
        </article>
    `;
}

function setupLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        displayArchivePosts();
    });
}

// Single post functionality
async function loadSinglePost() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        showError('No post specified.');
        return;
    }
    
    const post = allPosts.find(p => p.slug === slug);
    if (!post) {
        showError('Post not found.');
        return;
    }
    
    try {
        // Update page title and meta
        document.getElementById('postTitle').textContent = `${post.title} - ctrl alt debug`;
        document.getElementById('postTitleHeader').textContent = post.title;
        document.getElementById('postDate').textContent = formatDate(post.date);
        
        // Display tags
        const tagsContainer = document.getElementById('postTags');
        tagsContainer.innerHTML = post.tags.map(tag => 
            `<span class="tag">${escapeHtml(tag)}</span>`
        ).join('');
        
        // Adjust path for GitHub Pages if needed
        let postPath = post.path;
        // Check if we're on GitHub Pages (no localhost) and adjust path if needed
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            // Get the repository name from the pathname (for GitHub Pages)
            const pathParts = window.location.pathname.split('/');
            const repoName = pathParts.length > 1 ? pathParts[1] : '';
            
            // If we're in a GitHub Pages repo, adjust the path
            if (repoName) {
                // Make sure the path is relative to the repo root
                if (postPath.startsWith('/')) {
                    postPath = `/${repoName}${postPath}`;
                } else {
                    postPath = `/${repoName}/${postPath}`;
                }
            }
        }
        
        // Load and render post content
        const response = await fetch(postPath);
        if (!response.ok) {
            console.error(`Failed to load post: ${postPath} with status ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const markdown = await response.text();
        
        // Direct parsing of comments from markdown
        const commentsMatch = markdown.match(/comments:\s*\n([\s\S]*?)---/);
        let comments = [];
        
        if (commentsMatch && commentsMatch[1]) {
            const commentLines = commentsMatch[1].split('\n');
            let currentComment = null;
            
            for (const line of commentLines) {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('- author:')) {
                    if (currentComment) {
                        comments.push(currentComment);
                    }
                    currentComment = { author: trimmedLine.replace('- author:', '').trim().replace(/"/g, '') };
                } else if (currentComment && trimmedLine.startsWith('date:')) {
                    currentComment.date = trimmedLine.replace('date:', '').trim().replace(/"/g, '');
                } else if (currentComment && trimmedLine.startsWith('text:')) {
                    currentComment.text = trimmedLine.replace('text:', '').trim().replace(/"/g, '');
                }
            }
            
            if (currentComment) {
                comments.push(currentComment);
            }
        }
        
        const { content } = parseMarkdown(markdown);
        
        // Render content
        const contentContainer = document.getElementById('postContent');
        contentContainer.innerHTML = marked.parse(content);
        
        // Render comments
        renderComments(comments);
        
    } catch (error) {
        console.error('Error loading post:', error);
        showError('Failed to load post content.');
    }
}

function parseMarkdown(markdown) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    
    if (!match) {
        return { content: markdown, frontmatter: {} };
    }
    
    try {
        // Simple YAML parser for frontmatter
        const frontmatter = parseYAML(match[1]);
        const content = match[2];
        return { content, frontmatter };
    } catch (error) {
        console.error('Error parsing frontmatter:', error);
        return { content: markdown, frontmatter: {} };
    }
}

function parseYAML(yamlString) {
    const result = {};
    const lines = yamlString.split('\n');
    let currentKey = null;
    let currentArray = null;
    let currentObject = null;
    let indentLevel = 0;
    
    for (let line of lines) {
        const originalLine = line;
        line = line.trim();
        if (!line || line.startsWith('#')) continue;
        
        // Calculate indent level for nested structures
        const currentIndent = originalLine.search(/\S/);
        
        if (line.includes(':') && !line.startsWith('-')) {
            // Key-value pair
            const [key, ...valueParts] = line.split(':');
            const value = valueParts.join(':').trim();
            currentKey = key.trim();
            
            if (value.startsWith('[') && value.endsWith(']')) {
                // Inline array
                result[currentKey] = JSON.parse(value);
            } else if (value === '' || value === '[]') {
                // Array or empty value
                result[currentKey] = [];
                currentArray = result[currentKey];
                currentObject = null;
                indentLevel = currentIndent;
            } else if (value.startsWith('"') && value.endsWith('"')) {
                // Quoted string
                result[currentKey] = value.slice(1, -1);
            } else {
                // Regular value
                result[currentKey] = value;
            }
        } else if (line.startsWith('-')) {
            // Array item
            const item = line.substring(1).trim();
            
            // Reset current object when starting a new array item
            currentObject = {};
            
            if (item.includes(':')) {
                // Object in array
                const [objKey, ...objValueParts] = item.split(':');
                const objValue = objValueParts.join(':').trim();
                currentObject[objKey.trim()] = objValue.startsWith('"') && objValue.endsWith('"') 
                    ? objValue.slice(1, -1) 
                    : objValue;
            } else if (item) {
                // Simple array item
                currentObject = item.startsWith('"') && item.endsWith('"') 
                    ? item.slice(1, -1) 
                    : item;
            }
            
            if (currentArray) {
                currentArray.push(currentObject);
            }
        } else if (currentObject && typeof currentObject === 'object' && line.includes(':')) {
            // Additional properties for the current object in array
            const [key, ...valueParts] = line.split(':');
            const value = valueParts.join(':').trim();
            currentObject[key.trim()] = value.startsWith('"') && value.endsWith('"') 
                ? value.slice(1, -1) 
                : value;
        }
    }
    
    return result;
}

function renderComments(comments) {
    const commentsContainer = document.getElementById('comments');
    if (!commentsContainer) return;
    
    if (!comments || !Array.isArray(comments) || comments.length === 0) {
        commentsContainer.innerHTML = '<p class="no-comments">No comments yet.</p>';
        return;
    }
    
    const commentElements = comments.map(comment => {
        if (!comment || typeof comment !== 'object') return '';
        
        const author = comment.author ? escapeHtml(comment.author) : '';
        const text = comment.text ? escapeHtml(comment.text) : '';
        const date = comment.date ? comment.date : '';
        
        if (!author || !text) return '';
        
        return `
        <div class="comment">
            <div class="comment-header">
                <span class="comment-author">${author}</span>
                <span class="comment-date">${date}</span>
            </div>
            <div class="comment-body">${text}</div>
        </div>
        `;
    }).filter(Boolean).join('');
    
    commentsContainer.innerHTML = commentElements || '<p class="no-comments">No comments yet.</p>';
}

// Utility functions
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return dateString;
        }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showError(message) {
    console.error(message);
    
    // Try to show error in the main content area
    const containers = [
        document.getElementById('latestPosts'),
        document.getElementById('archivePosts'),
        document.getElementById('postContent')
    ];
    
    const container = containers.find(c => c !== null);
    if (container) {
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                <p>${escapeHtml(message)}</p>
            </div>
        `;
    }
}

// Configure marked.js for better code highlighting
if (typeof marked !== 'undefined') {
    marked.setOptions({
        highlight: function(code, lang) {
            // Basic syntax highlighting could be added here
            return code;
        },
        breaks: true,
        gfm: true
    });
}