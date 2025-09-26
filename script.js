// Blog functionality
class CtrlAltDebugBlog {
    constructor() {
        this.posts = [];
        this.currentView = 'home';
        this.currentPost = null;
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupNavigation();
        this.loadPosts();
        this.setupEventListeners();
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('.theme-icon');
        
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }

    setupNavigation() {
        // Navigation is now simplified - no nav links to handle
        // Just handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state) {
                if (e.state.view === 'post') {
                    this.showPost(e.state.postId, false);
                } else {
                    this.showPostsGrid(false);
                }
            } else {
                this.showPostsGrid(false);
            }
        });

        // Back button functionality
        const backBtn = document.getElementById('backBtn');
        backBtn.addEventListener('click', () => {
            this.showPostsGrid();
        });
    }

    setupEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state) {
                if (e.state.view === 'post') {
                    this.showPost(e.state.postId, false);
                } else {
                    this.showPostsGrid(false);
                }
            }
        });
    }

    async loadPosts() {
        // Since we can't actually read files from the posts folder in a static environment,
        // we'll simulate loading posts with sample data
        this.posts = await this.getSamplePosts();
        this.renderPosts();
    }

    async getSamplePosts() {
        // Simulate async loading with sample posts
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        id: 'debugging-javascript-like-pro',
                        title: 'Debugging JavaScript Like a Pro',
                        excerpt: 'Master the art of debugging with advanced techniques, tools, and strategies that will save you hours of frustration.',
                        date: '2024-01-15',
                        tags: ['JavaScript', 'Debugging', 'DevTools'],
                        content: `# Debugging JavaScript Like a Pro

Debugging is an essential skill for any JavaScript developer. In this comprehensive guide, we'll explore advanced debugging techniques that will transform you from a console.log warrior into a debugging ninja.

## The Debugging Mindset

Before diving into tools and techniques, it's crucial to develop the right mindset:

- **Stay calm and methodical** - Panic leads to poor decisions
- **Reproduce the bug consistently** - If you can't reproduce it, you can't fix it
- **Isolate the problem** - Narrow down the scope to find the root cause

## Essential Debugging Tools

### 1. Browser DevTools

Modern browsers provide powerful debugging capabilities:

\`\`\`javascript
// Use breakpoints instead of console.log
function calculateTotal(items) {
    debugger; // This will pause execution
    return items.reduce((sum, item) => sum + item.price, 0);
}
\`\`\`

### 2. Console Methods Beyond console.log

\`\`\`javascript
// Group related logs
console.group('User Authentication');
console.log('Checking credentials...');
console.warn('Invalid password format');
console.groupEnd();

// Table format for objects
console.table([
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 }
]);

// Performance timing
console.time('API Call');
// ... your code
console.timeEnd('API Call');
\`\`\`

## Advanced Debugging Strategies

### Error Boundaries in React

\`\`\`javascript
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
    }
}
\`\`\`

### Network Debugging

Monitor network requests and responses:

\`\`\`javascript
// Intercept fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
    console.log('Fetch request:', args);
    return originalFetch.apply(this, args)
        .then(response => {
            console.log('Fetch response:', response);
            return response;
        });
};
\`\`\`

## Common JavaScript Pitfalls

### 1. Asynchronous Code Issues

\`\`\`javascript
// Problem: Race conditions
let data = null;
fetchData().then(result => data = result);
console.log(data); // null - executes before fetch completes

// Solution: Proper async/await
async function handleData() {
    const data = await fetchData();
    console.log(data); // Correct timing
}
\`\`\`

### 2. Scope and Closure Problems

\`\`\`javascript
// Problem: Loop variable capture
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100); // Prints 3, 3, 3
}

// Solution: Use let or IIFE
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100); // Prints 0, 1, 2
}
\`\`\`

## Debugging Best Practices

1. **Write testable code** - Small, pure functions are easier to debug
2. **Use meaningful variable names** - Self-documenting code reduces bugs
3. **Implement proper error handling** - Fail gracefully with informative messages
4. **Use TypeScript** - Catch type-related errors at compile time
5. **Set up proper logging** - Structured logging helps in production debugging

## Conclusion

Effective debugging is a combination of the right tools, techniques, and mindset. Practice these strategies, and you'll find yourself solving complex issues with confidence and efficiency.

Remember: Every bug is an opportunity to learn something new about your code and improve your skills as a developer.`,
                        comments: [
                            {
                                author: 'Sarah Chen',
                                date: '2024-01-16',
                                content: 'Excellent guide! The section on error boundaries was particularly helpful. I\'ve been struggling with React error handling, and this cleared up a lot of confusion.'
                            },
                            {
                                author: 'Mike Rodriguez',
                                date: '2024-01-17',
                                content: 'The console methods beyond console.log are game-changers. I had no idea about console.table() - it\'s going to save me so much time when debugging complex objects.'
                            },
                            {
                                author: 'Alex Thompson',
                                date: '2024-01-18',
                                content: 'Great post! One thing I\'d add is using the Network tab in DevTools to debug API calls. It\'s been invaluable for catching CORS issues and malformed requests.'
                            }
                        ]
                    },
                    {
                        id: 'modern-css-grid-layouts',
                        title: 'Modern CSS Grid Layouts: Beyond the Basics',
                        excerpt: 'Explore advanced CSS Grid techniques to create complex, responsive layouts that adapt beautifully to any screen size.',
                        date: '2024-01-10',
                        tags: ['CSS', 'Grid', 'Responsive Design'],
                        content: `# Modern CSS Grid Layouts: Beyond the Basics

CSS Grid has revolutionized how we approach web layouts. While many developers are familiar with basic grid concepts, there's a whole world of advanced techniques that can take your layouts to the next level.

## Grid Areas and Template Areas

One of the most powerful features of CSS Grid is the ability to define named grid areas:

\`\`\`css
.container {
    display: grid;
    grid-template-areas: 
        "header header header"
        "sidebar main aside"
        "footer footer footer";
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
\`\`\`

## Responsive Grid Without Media Queries

Create responsive layouts using \`auto-fit\` and \`minmax()\`:

\`\`\`css
.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}
\`\`\`

This creates a grid that automatically adjusts the number of columns based on available space.

## Advanced Grid Functions

### The \`fr\` Unit in Complex Scenarios

\`\`\`css
.complex-layout {
    display: grid;
    grid-template-columns: 
        minmax(200px, 1fr) 
        minmax(400px, 2fr) 
        minmax(150px, 1fr);
}
\`\`\`

### Using \`fit-content()\`

\`\`\`css
.adaptive-sidebar {
    display: grid;
    grid-template-columns: fit-content(250px) 1fr;
}
\`\`\`

## Grid and Flexbox: The Perfect Combination

Don't think of Grid and Flexbox as competing technologies. They work beautifully together:

\`\`\`css
.card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.card {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 8px;
    overflow: hidden;
}

.card-content {
    flex: 1;
    padding: 1.5rem;
}

.card-actions {
    padding: 1rem 1.5rem;
    border-top: 1px solid #eee;
}
\`\`\`

## Subgrid: The Future of Nested Layouts

While browser support is still growing, subgrid allows child grids to inherit parent grid tracks:

\`\`\`css
.parent-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
}

.child-grid {
    display: grid;
    grid-column: span 2;
    grid-template-columns: subgrid;
}
\`\`\`

## Practical Example: Magazine Layout

Let's create a complex magazine-style layout:

\`\`\`css
.magazine {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(8, 100px);
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto;
}

.hero-article {
    grid-column: 1 / 8;
    grid-row: 1 / 5;
}

.featured-1 {
    grid-column: 8 / 13;
    grid-row: 1 / 3;
}

.featured-2 {
    grid-column: 8 / 13;
    grid-row: 3 / 5;
}

.sidebar {
    grid-column: 1 / 4;
    grid-row: 5 / 9;
}

.content-area {
    grid-column: 4 / 13;
    grid-row: 5 / 9;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}
\`\`\`

## Performance Considerations

Grid layouts are generally performant, but keep these tips in mind:

1. **Avoid excessive nesting** - Deep grid hierarchies can impact performance
2. **Use \`contain: layout\`** - Helps browsers optimize rendering
3. **Be mindful of implicit grids** - Large implicit grids can consume memory

## Browser Support and Fallbacks

While CSS Grid has excellent modern browser support, consider fallbacks:

\`\`\`css
.layout {
    /* Flexbox fallback */
    display: flex;
    flex-wrap: wrap;
}

@supports (display: grid) {
    .layout {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
}
\`\`\`

## Conclusion

CSS Grid opens up possibilities that were previously impossible or required complex JavaScript. By mastering these advanced techniques, you can create layouts that are not only visually stunning but also maintainable and accessible.

The key is to think in terms of two-dimensional layouts and leverage Grid's powerful sizing and positioning capabilities to create truly responsive designs.`,
                        comments: [
                            {
                                author: 'Emma Wilson',
                                date: '2024-01-11',
                                content: 'The magazine layout example is fantastic! I\'ve been trying to recreate a similar design for weeks. The grid-template-areas approach makes so much more sense than my previous attempts with floats and positioning.'
                            },
                            {
                                author: 'David Park',
                                date: '2024-01-12',
                                content: 'Love the section on combining Grid and Flexbox. Too many developers think they have to choose one or the other, but they really complement each other perfectly.'
                            }
                        ]
                    },
                    {
                        id: 'react-performance-optimization',
                        title: 'React Performance Optimization: A Complete Guide',
                        excerpt: 'Learn how to identify performance bottlenecks and implement optimization strategies to make your React applications lightning fast.',
                        date: '2024-01-05',
                        tags: ['React', 'Performance', 'Optimization'],
                        content: `# React Performance Optimization: A Complete Guide

Performance is crucial for user experience. A slow React application can frustrate users and hurt your business metrics. In this comprehensive guide, we'll explore proven strategies to optimize your React applications.

## Understanding React's Rendering Process

Before optimizing, it's essential to understand how React works:

1. **Reconciliation** - React compares the new virtual DOM with the previous version
2. **Diffing** - React identifies what has changed
3. **Rendering** - React updates only the changed parts in the real DOM

## Identifying Performance Issues

### React DevTools Profiler

The React DevTools Profiler is your best friend for identifying performance bottlenecks:

\`\`\`javascript
// Wrap your app with Profiler in development
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
    console.log('Component:', id, 'Phase:', phase, 'Duration:', actualDuration);
}

function App() {
    return (
        <Profiler id="App" onRender={onRenderCallback}>
            <MyComponent />
        </Profiler>
    );
}
\`\`\`

### Performance Metrics to Watch

- **Render time** - How long components take to render
- **Re-render frequency** - How often components update unnecessarily
- **Bundle size** - Impact on initial load time

## Optimization Techniques

### 1. Memoization with React.memo

Prevent unnecessary re-renders of functional components:

\`\`\`javascript
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
    console.log('ExpensiveComponent rendered');
    
    return (
        <div>
            {data.map(item => (
                <div key={item.id}>{item.name}</div>
            ))}
        </div>
    );
});

// Custom comparison function
const MyComponent = React.memo(({ user, posts }) => {
    return <div>{/* component content */}</div>;
}, (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id &&
           prevProps.posts.length === nextProps.posts.length;
});
\`\`\`

### 2. useMemo and useCallback Hooks

Optimize expensive calculations and function references:

\`\`\`javascript
function DataProcessor({ items, filter }) {
    // Memoize expensive calculations
    const processedData = useMemo(() => {
        console.log('Processing data...');
        return items
            .filter(item => item.category === filter)
            .sort((a, b) => a.priority - b.priority)
            .map(item => ({
                ...item,
                displayName: \`\${item.name} (\${item.category})\`
            }));
    }, [items, filter]);

    // Memoize callback functions
    const handleItemClick = useCallback((itemId) => {
        console.log('Item clicked:', itemId);
        // Handle click logic
    }, []);

    return (
        <div>
            {processedData.map(item => (
                <Item 
                    key={item.id} 
                    data={item} 
                    onClick={handleItemClick}
                />
            ))}
        </div>
    );
}
\`\`\`

### 3. Code Splitting and Lazy Loading

Reduce initial bundle size with dynamic imports:

\`\`\`javascript
import { lazy, Suspense } from 'react';

// Lazy load components
const Dashboard = lazy(() => import('./Dashboard'));
const Profile = lazy(() => import('./Profile'));
const Settings = lazy(() => import('./Settings'));

function App() {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </Suspense>
        </Router>
    );
}
\`\`\`

### 4. Virtualization for Large Lists

Handle large datasets efficiently:

\`\`\`javascript
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }) {
    const Row = ({ index, style }) => (
        <div style={style}>
            <div className="list-item">
                {items[index].name}
            </div>
        </div>
    );

    return (
        <List
            height={600}
            itemCount={items.length}
            itemSize={50}
            width="100%"
        >
            {Row}
        </List>
    );
}
\`\`\`

### 5. Optimizing State Updates

Minimize re-renders by optimizing state structure:

\`\`\`javascript
// Bad: Single state object causes all components to re-render
const [state, setState] = useState({
    user: null,
    posts: [],
    comments: [],
    ui: { loading: false, error: null }
});

// Good: Separate state for different concerns
const [user, setUser] = useState(null);
const [posts, setPosts] = useState([]);
const [comments, setComments] = useState([]);
const [ui, setUi] = useState({ loading: false, error: null });
\`\`\`

### 6. Debouncing User Input

Prevent excessive API calls and re-renders:

\`\`\`javascript
import { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

function SearchComponent() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const debouncedSearch = useMemo(
        () => debounce(async (searchQuery) => {
            if (searchQuery) {
                const response = await fetch(\`/api/search?q=\${searchQuery}\`);
                const data = await response.json();
                setResults(data);
            } else {
                setResults([]);
            }
        }, 300),
        []
    );

    useEffect(() => {
        debouncedSearch(query);
        return () => debouncedSearch.cancel();
    }, [query, debouncedSearch]);

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
            />
            <SearchResults results={results} />
        </div>
    );
}
\`\`\`

## Advanced Optimization Strategies

### 1. Server-Side Rendering (SSR)

Improve initial page load and SEO:

\`\`\`javascript
// Next.js example
export async function getServerSideProps(context) {
    const data = await fetchData();
    
    return {
        props: {
            data
        }
    };
}
\`\`\`

### 2. Progressive Web App (PWA) Features

Implement caching and offline functionality:

\`\`\`javascript
// Service worker for caching
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
\`\`\`

## Performance Monitoring

### 1. Web Vitals

Monitor Core Web Vitals in production:

\`\`\`javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
\`\`\`

### 2. Custom Performance Metrics

Track application-specific metrics:

\`\`\`javascript
// Measure component render time
function useRenderTime(componentName) {
    useEffect(() => {
        const startTime = performance.now();
        
        return () => {
            const endTime = performance.now();
            console.log(\`\${componentName} render time: \${endTime - startTime}ms\`);
        };
    });
}
\`\`\`

## Common Performance Anti-Patterns

### 1. Creating Objects in Render

\`\`\`javascript
// Bad: Creates new object on every render
function MyComponent({ items }) {
    return (
        <ChildComponent 
            style={{ marginTop: 10 }} // New object every render
            data={items.map(item => ({ ...item, processed: true }))} // New array every render
        />
    );
}

// Good: Memoize or move outside component
const STYLE = { marginTop: 10 };

function MyComponent({ items }) {
    const processedData = useMemo(
        () => items.map(item => ({ ...item, processed: true })),
        [items]
    );
    
    return (
        <ChildComponent 
            style={STYLE}
            data={processedData}
        />
    );
}
\`\`\`

### 2. Inline Event Handlers

\`\`\`javascript
// Bad: New function on every render
function TodoList({ todos, onToggle }) {
    return (
        <ul>
            {todos.map(todo => (
                <li key={todo.id}>
                    <input
                        type="checkbox"
                        onChange={() => onToggle(todo.id)} // New function every render
                    />
                    {todo.text}
                </li>
            ))}
        </ul>
    );
}

// Good: Memoized callback
function TodoList({ todos, onToggle }) {
    const handleToggle = useCallback((todoId) => {
        onToggle(todoId);
    }, [onToggle]);
    
    return (
        <ul>
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                />
            ))}
        </ul>
    );
}
\`\`\`

## Conclusion

React performance optimization is an ongoing process that requires understanding your application's specific needs and bottlenecks. Start with measuring and profiling, then apply optimizations strategically.

Remember:
- **Measure first** - Don't optimize prematurely
- **Focus on user experience** - Optimize what users actually notice
- **Monitor in production** - Performance can vary significantly in real-world conditions

By following these strategies and continuously monitoring your application's performance, you can ensure your React applications provide a smooth, fast user experience that keeps users engaged and satisfied.`,
                        comments: [
                            {
                                author: 'Jennifer Liu',
                                date: '2024-01-06',
                                content: 'This is incredibly comprehensive! The section on virtualization saved my app when dealing with a list of 10,000+ items. Performance went from unusable to buttery smooth.'
                            },
                            {
                                author: 'Carlos Martinez',
                                date: '2024-01-07',
                                content: 'The anti-patterns section is gold. I was guilty of creating objects in render and couldn\'t figure out why my components were re-rendering so much. Thanks for the clear examples!'
                            },
                            {
                                author: 'Priya Patel',
                                date: '2024-01-08',
                                content: 'Great guide! One thing I\'d add is the importance of measuring performance on lower-end devices. What feels fast on a developer machine might be sluggish on a budget phone.'
                            }
                        ]
                    }
                ]);
            }, 500);
        });
    }

    renderPosts() {
        const postsGrid = document.getElementById('postsGrid');
        const postDetail = document.getElementById('postDetail');
        
        postDetail.style.display = 'none';
        postsGrid.style.display = 'grid';
        
        postsGrid.innerHTML = this.posts.map(post => `
            <article class="post-card fade-in" data-post-id="${post.id}">
                <div class="post-meta">
                    <span class="post-date">📅 ${this.formatDate(post.date)}</span>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <a href="#" class="read-more">Read More →</a>
            </article>
        `).join('');

        // Add click event listeners to post cards
        const postCards = document.querySelectorAll('.post-card');
        postCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = card.getAttribute('data-post-id');
                this.showPost(postId);
            });
        });
    }

    showPost(postId, updateHistory = true) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        this.currentPost = post;
        
        const postsGrid = document.getElementById('postsGrid');
        const postDetail = document.getElementById('postDetail');
        const postContent = document.getElementById('postContent');
        const commentsSection = document.getElementById('commentsSection');

        postsGrid.style.display = 'none';
        postDetail.style.display = 'block';

        // Render post content with markdown
        const renderedContent = marked.parse(post.content);
        postContent.innerHTML = `
            <div class="post-meta">
                <span class="post-date">📅 ${this.formatDate(post.date)}</span>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            ${renderedContent}
        `;

        // Render comments
        commentsSection.innerHTML = `
            <h3 class="comments-title">Comments (${post.comments.length})</h3>
            ${post.comments.map(comment => `
                <div class="comment">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-date">${this.formatDate(comment.date)}</span>
                    </div>
                    <div class="comment-content">${comment.content}</div>
                </div>
            `).join('')}
        `;

        // Highlight code blocks
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        // Update browser history
        if (updateHistory) {
            history.pushState({ view: 'post', postId }, post.title, `#${postId}`);
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showPostsGrid(updateHistory = true) {
        const postsGrid = document.getElementById('postsGrid');
        const postDetail = document.getElementById('postDetail');

        postDetail.style.display = 'none';
        postsGrid.style.display = 'grid';

        this.currentPost = null;

        // Update browser history
        if (updateHistory) {
            history.pushState({ view: 'home' }, 'Ctrl Alt Debug', '/');
        }

        // Update active nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-page') === 'home');
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Initialize the blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CtrlAltDebugBlog();
});

// Handle initial page load with hash
window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1);
    if (hash && window.blog) {
        const post = window.blog.posts.find(p => p.id === hash);
        if (post) {
            window.blog.showPost(hash, false);
        }
    }
});

// Export for global access
window.CtrlAltDebugBlog = CtrlAltDebugBlog;