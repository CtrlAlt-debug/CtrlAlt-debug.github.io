// Blog functionality for Ctrl Alt Debug
class BlogManager {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.postsContainer = document.getElementById('posts-container');
        this.loadingElement = document.getElementById('loading');
        this.noPostsElement = document.getElementById('no-posts');
        this.searchInput = document.getElementById('search-input');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPosts();
    }

    setupEventListeners() {
        // Search functionality
        this.searchInput.addEventListener('input', (e) => {
            this.filterPosts(e.target.value);
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e.target);
            });
        });

        // Theme toggle (for future enhancement)
        document.querySelector('.theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    async loadPosts() {
        try {
            this.showLoading();
            
            // Since we're on GitHub Pages, we'll use a posts.json file to list all posts
            // This will be generated or maintained manually
            const response = await fetch('./posts/posts.json');
            
            if (!response.ok) {
                // If posts.json doesn't exist, try to load some default posts
                this.loadDefaultPosts();
                return;
            }

            const postsData = await response.json();
            // Handle both array format and object with posts property
            const postFiles = Array.isArray(postsData) ? postsData : postsData.posts;
            this.posts = await this.loadPostContents(postFiles);
            
        } catch (error) {
            console.log('Loading default posts due to error:', error);
            this.loadDefaultPosts();
        }
    }

    async loadPostContents(postFiles) {
        const posts = [];
        
        for (const filename of postFiles) {
            try {
                const response = await fetch(`./posts/${filename}`);
                if (response.ok) {
                    const content = await response.text();
                    const post = this.parsePost(filename, content);
                    if (post) {
                        posts.push(post);
                    }
                }
            } catch (error) {
                console.error(`Error loading post ${filename}:`, error);
            }
        }

        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        this.filteredPosts = posts;
        this.displayPosts();
        return posts;
    }

    parsePost(filename, content) {
        // Extract date from filename (format: DD/MM/YYYY-title.md or DD-MM-YYYY-title.md)
        const dateMatch = filename.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
        if (!dateMatch) {
            console.warn(`Invalid date format in filename: ${filename}`);
            return null;
        }

        const [, day, month, year] = dateMatch;
        const date = new Date(year, month - 1, day);
        
        // Parse markdown content
        const lines = content.split('\n');
        let title = '';
        let excerpt = '';
        let tags = [];
        let comments = [];
        let bodyStart = 0;
        let inComments = false;
        let currentComment = null;

        // Look for title (first # heading)
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('# ')) {
                title = line.substring(2).trim();
                bodyStart = i + 1;
                break;
            }
        }

        // If no title found, use filename
        if (!title) {
            title = filename.replace(/^\d{2}[\/\-]\d{2}[\/\-]\d{4}[\/\-]?/, '').replace(/\.(md|txt)$/, '').replace(/[-_]/g, ' ');
            title = title.charAt(0).toUpperCase() + title.slice(1);
        }

        // Look for tags and comments
        for (let i = bodyStart; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.toLowerCase().startsWith('tags:')) {
                tags = line.substring(5).split(',').map(tag => tag.trim()).filter(tag => tag);
                bodyStart = Math.max(bodyStart, i + 1);
            } else if (line === 'Comments:') {
                inComments = true;
                bodyStart = Math.max(bodyStart, i + 1);
            } else if (inComments && line.startsWith('- author:')) {
                // Save previous comment if exists
                if (currentComment) {
                    comments.push(currentComment);
                }
                // Start new comment - extract author value after colon
                const authorMatch = line.match(/- author:\s*["']?([^"']+)["']?/);
                currentComment = {
                    author: authorMatch ? authorMatch[1].trim() : '',
                    date: '',
                    text: '',
                    likes: 0
                };
            } else if (inComments && line.match(/^\s+date:/)) {
                if (currentComment) {
                    const dateMatch = line.match(/date:\s*["']?([^"']+)["']?/);
                    currentComment.date = dateMatch ? dateMatch[1].trim() : '';
                }
            } else if (inComments && line.match(/^\s+text:/)) {
                if (currentComment) {
                    const textMatch = line.match(/text:\s*["']?([^"']+)["']?/);
                    currentComment.text = textMatch ? textMatch[1].trim() : '';
                }
            } else if (inComments && line.match(/^\s+likes:/)) {
                if (currentComment) {
                    const likesMatch = line.match(/likes:\s*(\d+)/);
                    currentComment.likes = likesMatch ? parseInt(likesMatch[1]) : 0;
                }
            } else if (inComments && line === '' && currentComment) {
                // End of current comment
                comments.push(currentComment);
                currentComment = null;
            } else if (inComments && line !== '' && !line.match(/^\s/) && !line.startsWith('- author:')) {
                // End of comments section
                if (currentComment) {
                    comments.push(currentComment);
                    currentComment = null;
                }
                inComments = false;
                bodyStart = Math.max(bodyStart, i);
                break;
            }
        }
        
        // Add last comment if exists
        if (currentComment) {
            comments.push(currentComment);
        }

        // Extract only the content part (excluding comments)
        const contentLines = [];
        let foundCommentsSection = false;
        
        for (let i = bodyStart; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim() === 'Comments:') {
                foundCommentsSection = true;
                break;
            }
            contentLines.push(line);
        }
        
        const postContent = contentLines.join('\n').trim();
        
        // Create excerpt from first few lines of content
        const excerptLines = contentLines.filter(line => line.trim());
        excerpt = excerptLines.slice(0, 3).join(' ').substring(0, 200);
        if (excerpt.length === 200) excerpt += '...';

        return {
            filename,
            title,
            date,
            excerpt,
            tags,
            comments,
            content: postContent
        };
    }

    loadDefaultPosts() {
        // Create some default posts to demonstrate functionality
        this.posts = [
            {
                filename: '15/01/2025-getting-started-with-react.md',
                title: 'Getting Started with React in 2025',
                date: new Date(2025, 0, 15),
                excerpt: 'React continues to evolve, and 2025 brings exciting new features and improvements. In this comprehensive guide, we\'ll explore the latest React patterns, hooks, and best practices that every developer should know.',
                tags: ['React', 'JavaScript', 'Frontend', 'Tutorial'],
                content: 'Full content would be here...'
            },
            {
                filename: '10/01/2025-debugging-javascript-like-pro.md',
                title: 'Debugging JavaScript Like a Pro',
                date: new Date(2025, 0, 10),
                excerpt: 'Debugging is an essential skill for any developer. Learn advanced debugging techniques, tools, and strategies that will help you identify and fix issues faster than ever before.',
                tags: ['JavaScript', 'Debugging', 'DevTools', 'Tips'],
                content: 'Full content would be here...'
            },
            {
                filename: '05/01/2025-modern-css-techniques.md',
                title: 'Modern CSS Techniques for 2025',
                date: new Date(2025, 0, 5),
                excerpt: 'CSS has come a long way! Discover the latest CSS features including container queries, cascade layers, and new color functions that are revolutionizing web design.',
                tags: ['CSS', 'Web Design', 'Frontend', 'Modern'],
                content: 'Full content would be here...'
            }
        ];

        this.filteredPosts = this.posts;
        this.displayPosts();
    }

    displayPosts() {
        this.hideLoading();

        if (this.filteredPosts.length === 0) {
            this.showNoPosts();
            return;
        }

        this.hideNoPosts();
        
        this.postsContainer.innerHTML = this.filteredPosts.map(post => `
            <article class="post-card" data-filename="${post.filename}">
                <div class="post-meta">
                    <div class="post-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${this.formatDate(post.date)}
                    </div>
                </div>
                <h2 class="post-title">${post.title}</h2>
                <p class="post-excerpt">${post.excerpt}</p>
                ${post.tags.length > 0 ? `
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <a href="#" class="read-more" onclick="blogManager.openPost('${post.filename}')">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </article>
        `).join('');
    }

    filterPosts(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredPosts = this.posts;
        } else {
            const term = searchTerm.toLowerCase();
            this.filteredPosts = this.posts.filter(post => 
                post.title.toLowerCase().includes(term) ||
                post.excerpt.toLowerCase().includes(term) ||
                post.tags.some(tag => tag.toLowerCase().includes(term))
            );
        }
        this.displayPosts();
    }

    openPost(filename) {
        const post = this.posts.find(p => p.filename === filename);
        if (post) {
            this.showPostDetail(post);
        }
    }

    showPostDetail(post) {
        const main = document.querySelector('.main .container');
        const formattedContent = this.formatMarkdownContent(post.content);
        
        // Generate permanent comments from markdown metadata
        const permanentCommentsHtml = post.comments && post.comments.length > 0 
            ? post.comments.map(comment => `
                <div class="comment permanent-comment">
                    <div class="comment-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="comment-author">${comment.author}</span>
                            <span class="comment-date">${comment.date}</span>
                        </div>
                        <p class="comment-text">${comment.text}</p>
                        <div class="comment-actions">
                            <button class="comment-action"><i class="fas fa-thumbs-up"></i> ${comment.likes}</button>
                            <button class="comment-action"><i class="fas fa-reply"></i> Reply</button>
                        </div>
                    </div>
                </div>
            `).join('')
            : '<p class="no-comments">Be the first to comment on this post!</p>';
        
        main.innerHTML = `
            <article class="post-detail">
                <header class="post-header">
                    <div class="post-meta">
                        <div class="post-date">
                            <i class="fas fa-calendar-alt"></i>
                            ${this.formatDate(post.date)}
                        </div>
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <h1 class="post-title">${post.title}</h1>
                </header>
                
                <div class="post-content">
                    ${formattedContent}
                </div>
                
                <div class="post-navigation">
                    <button onclick="blogManager.showHome()" class="btn-back">
                        <i class="fas fa-arrow-left"></i> Back to Posts
                    </button>
                </div>
                
                <div class="comments-section">
                    <h3 class="comments-title">
                        <i class="fas fa-comments"></i>
                        Comments ${post.comments ? `(${post.comments.length})` : ''}
                    </h3>
                    
                    <!-- Comments from markdown -->
                    <div class="comments-list">
                        ${permanentCommentsHtml}
                    </div>
                </div>
            </article>
        `;
    }
    
    formatMarkdownContent(content) {
        // Simple markdown to HTML conversion
        return content
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.*)$/gm, '<p>$1</p>')
            .replace(/<p><\/p>/g, '')
            .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1')
            .replace(/<p>(<pre>.*<\/pre>)<\/p>/g, '$1');
    }

    formatDate(date) {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    handleNavigation(link) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');

        // Handle different navigation sections
        const href = link.getAttribute('href');
        switch(href) {
            case '#home':
                this.showHome();
                break;
            case '#archive':
                this.showArchive();
                break;
            case '#contact':
                this.showContact();
                break;
        }
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('main section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show requested section
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
        }
    }



    showArchive() {
        const main = document.querySelector('.main .container');
        main.innerHTML = `
            <div class="content-section">
                <h2><i class="fas fa-archive"></i> Post Archive</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Browse through all ${this.posts.length} posts or use the search to find something specific.</p>
                
                <div class="archive-search-container">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="archive-search-input" placeholder="Search posts by title, content, or tags...">
                    </div>
                </div>
                
                <div class="archive-list" id="archive-list">
                    <!-- All posts will be displayed here -->
                </div>
            </div>
        `;
        
        // Initialize search functionality
        this.archiveSearchInput = document.getElementById('archive-search-input');
        this.archiveList = document.getElementById('archive-list');
        
        // Setup search functionality
        this.archiveSearchInput.addEventListener('input', (e) => {
            this.filterArchivePosts(e.target.value);
        });
        
        // Display all posts initially
        this.displayArchivePosts(this.posts);
    }

    filterArchivePosts(searchTerm) {
        if (!searchTerm.trim()) {
            this.displayArchivePosts(this.posts);
            return;
        }

        const filtered = this.posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        this.displayArchivePosts(filtered);
    }

    displayArchivePosts(posts) {
        if (posts.length === 0) {
            this.archiveList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No posts found matching your search.</p>
                </div>
            `;
            return;
        }

        this.archiveList.innerHTML = posts.map(post => `
            <div class="archive-item" onclick="blogManager.openPost('${post.filename}')">
                <div class="archive-date">${this.formatDate(post.date)}</div>
                <div class="archive-content">
                    <h3 class="archive-title">${post.title}</h3>
                    <p class="archive-excerpt">${post.excerpt}</p>
                    ${post.tags.length > 0 ? `
                        <div class="archive-tags">
                            ${post.tags.map(tag => `<span class="archive-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    showContact() {
        const contactContent = `
            <div class="content-section">
                <h2>Get In Touch</h2>
                <p>Have questions, suggestions, or want to collaborate? We'd love to hear from you!</p>
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>hello@ctrlaltdebug.dev</span>
                    </div>
                    <div class="contact-item">
                        <i class="fab fa-github"></i>
                        <span>github.com/ctrlaltdebug</span>
                    </div>
                    <div class="contact-item">
                        <i class="fab fa-twitter"></i>
                        <span>@ctrlaltdebug</span>
                    </div>
                </div>
            </div>
        `;
        this.showCustomContent(contactContent);
    }

    showCustomContent(content) {
        const main = document.querySelector('.main .container');
        main.innerHTML = `
            <section class="hero">
                <div class="hero-content">
                    <h2>Ctrl Alt Debug</h2>
                    <p>Your go-to destination for cutting-edge tech insights</p>
                </div>
            </section>
            ${content}
            <div style="margin-top: 2rem;">
                <button onclick="blogManager.showHome()" class="btn-back">← Back to Posts</button>
            </div>
        `;
    }

    showHome() {
        // Restore the original home page content
        const main = document.querySelector('.main .container');
        main.innerHTML = `
            <section class="hero">
                <div class="hero-content">
                    <h2>Welcome to Ctrl Alt Debug</h2>
                    <p>Your go-to destination for cutting-edge tech insights, debugging adventures, and programming wisdom.</p>
                </div>
            </section>

            <section class="blog-posts" id="blog-posts">
                <div class="posts-header">
                    <h3>Latest Posts</h3>
                </div>
                <div class="posts-grid" id="posts-container">
                    <!-- Recent blog posts will be dynamically loaded here -->
                </div>
                <div class="loading" id="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading posts...</p>
                </div>
                <div class="no-posts" id="no-posts" style="display: none;">
                    <i class="fas fa-file-alt"></i>
                    <p>No posts found. Create your first post in the 'posts' directory!</p>
                </div>
                <div class="view-all-posts">
                    <a href="#" onclick="blogManager.showArchive()" class="btn-view-all">
                        <i class="fas fa-archive"></i> View All Posts
                    </a>
                </div>
            </section>
        `;
        
        // Reinitialize components
        this.postsContainer = document.getElementById('posts-container');
        this.loadingElement = document.getElementById('loading');
        this.noPostsElement = document.getElementById('no-posts');
        
        // Display only recent posts (limit to 5)
        this.displayRecentPosts();
    }

    displayRecentPosts() {
        this.hideLoading();

        if (this.posts.length === 0) {
            this.showNoPosts();
            return;
        }

        this.hideNoPosts();
        
        // Show only the 5 most recent posts
        const recentPosts = this.posts.slice(0, 5);
        
        this.postsContainer.innerHTML = recentPosts.map(post => `
            <article class="post-card" data-filename="${post.filename}">
                <div class="post-meta">
                    <div class="post-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${this.formatDate(post.date)}
                    </div>
                </div>
                <h2 class="post-title">${post.title}</h2>
                <p class="post-excerpt">${post.excerpt}</p>
                ${post.tags.length > 0 ? `
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <a href="#" class="read-more" onclick="blogManager.openPost('${post.filename}')">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </article>
        `).join('');
    }

    toggleTheme() {
        // Show message instead of switching to light mode
        alert('light mode is stupid');
    }

    showLoading() {
        this.loadingElement.style.display = 'block';
        this.postsContainer.style.display = 'none';
        this.noPostsElement.style.display = 'none';
    }

    hideLoading() {
        this.loadingElement.style.display = 'none';
        this.postsContainer.style.display = 'grid';
    }

    showNoPosts() {
        this.noPostsElement.style.display = 'block';
        this.postsContainer.style.display = 'none';
    }

    hideNoPosts() {
        this.noPostsElement.style.display = 'none';
    }
}

// Initialize the blog when the page loads
let blogManager;
document.addEventListener('DOMContentLoaded', () => {
    blogManager = new BlogManager();
});

// Add some additional CSS for the custom content sections
const additionalStyles = `
    .content-section {
        background: var(--bg-secondary);
        border-radius: 15px;
        padding: 2rem;
        margin: 2rem 0;
        border: 1px solid var(--border-color);
    }

    .content-section h2 {
        color: var(--accent-primary);
        margin-bottom: 1rem;
    }

    .content-section h3 {
        color: var(--text-primary);
        margin: 1.5rem 0 1rem 0;
    }

    .content-section ul {
        margin-left: 1.5rem;
        color: var(--text-secondary);
    }

    .content-section li {
        margin-bottom: 0.5rem;
    }

    .archive-search-container {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: var(--bg-tertiary);
        border-radius: 12px;
        border: 1px solid var(--border-color);
    }

    .archive-search-container .search-box {
        margin: 0;
        max-width: 500px;
    }

    .archive-search-container .search-box input {
        padding: 0.875rem 1rem 0.875rem 3rem;
        font-size: 1rem;
        border-radius: 8px;
    }

    .archive-list {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        margin-top: 1.5rem;
    }

    .archive-item {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 1.5rem;
        background: var(--bg-tertiary);
        border-radius: 12px;
        transition: all 0.3s ease;
        border: 1px solid transparent;
        cursor: pointer;
    }

    .archive-item:hover {
        background: var(--hover-bg);
        border-color: var(--accent-primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .archive-date {
        color: var(--accent-primary);
        font-weight: 600;
        min-width: 120px;
        font-size: 0.9rem;
        background: rgba(0, 204, 255, 0.1);
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        text-align: center;
    }

    .archive-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .archive-title {
        color: var(--text-primary);
        text-decoration: none;
        font-weight: 600;
        font-size: 1.1rem;
        margin: 0;
        transition: color 0.3s ease;
    }

    .archive-title:hover {
        color: var(--accent-primary);
    }

    .archive-excerpt {
        color: var(--text-secondary);
        font-size: 0.9rem;
        line-height: 1.4;
        margin: 0;
    }

    .archive-tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: 0.5rem;
    }

    .archive-tag {
        background: rgba(0, 204, 255, 0.1);
        color: var(--accent-primary);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
    }

    @media (max-width: 768px) {
        .archive-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .archive-date {
            min-width: auto;
            align-self: flex-start;
        }
    }

    .contact-info {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 2rem;
    }

    .contact-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: var(--text-secondary);
    }

    .contact-item i {
        color: var(--accent-primary);
        width: 20px;
    }

    .btn-back {
        background: var(--accent-primary);
        color: var(--bg-primary);
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-back:hover {
        background: #00b8e6;
        transform: translateY(-2px);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);