# ctrl alt debug

A minimal, static tech blog built for GitHub Pages with zero maintenance overhead. Write posts in Markdown, update a single JSON file, and you're done.

## ✨ Features

- **Zero Build Process**: Pure HTML/CSS/JS that works on GitHub Pages out of the box
- **Markdown Posts**: Write in Markdown with YAML frontmatter
- **Static Comments**: Author-controlled comments stored in post files
- **Real-time Search**: Client-side search and filtering by title, excerpt, and tags
- **Responsive Design**: Mobile-first, modern UI that looks great everywhere
- **Dark Mode**: Toggle between light and dark themes
- **Performance Focused**: Fast loading, minimal dependencies

## 🚀 Quick Start

1. **Fork or download** this repository
2. **Add your first post** to the `posts/` folder
3. **Update** `posts/index.json` with your post metadata
4. **Push to GitHub** and enable GitHub Pages
5. **Done!** Your blog is live

## 📝 Adding a New Post

### Step 1: Create the Markdown File

Create a new file in the `posts/` folder with the naming convention: `YYYY-MM-DD-post-title.md`

```markdown
---
title: "Your Post Title"
date: "2025-01-20T10:00:00Z"
excerpt: "A brief one-sentence summary of your post."
tags: ["tag1", "tag2", "tag3"]
slug: "your-post-slug"
comments:
  - author: "Reader Name"
    date: "2025-01-21"
    text: "Great post! Really helpful insights."
---

# Your Post Content

Write your post content here using standard Markdown syntax.

## Code Examples

```javascript
function example() {
    console.log("Code blocks are fully supported!");
}
```

## Lists and More

- Bullet points work
- **Bold text** and *italic text*
- [Links](https://example.com) are supported
- > Blockquotes too

Everything you expect from Markdown is available.
```

### Step 2: Update the Index File

Add an entry to `posts/index.json`:

```json
[
  {
    "title": "Your Post Title",
    "date": "2025-01-20T10:00:00Z",
    "excerpt": "A brief one-sentence summary of your post.",
    "tags": ["tag1", "tag2", "tag3"],
    "path": "posts/2025-01-20-your-post-title.md",
    "slug": "your-post-slug"
  },
  // ... existing posts
]
```

**Important**: 
- Add new posts at the **top** of the array (they'll be sorted by date anyway)
- Ensure the `path` matches your actual file location
- The `slug` should be URL-friendly (no spaces, special characters)
- Use ISO 8601 format for dates: `YYYY-MM-DDTHH:MM:SSZ`

### Step 3: Push and Publish

Commit your changes and push to GitHub. If you have GitHub Pages enabled, your new post will be live within minutes.

## 💬 Managing Comments

Comments are stored directly in each post's frontmatter. To add or modify comments:

1. **Edit the post's Markdown file**
2. **Update the `comments` array** in the YAML frontmatter:

```yaml
comments:
  - author: "Alice Johnson"
    date: "2025-01-15"
    text: "Excellent explanation of the concepts!"
  - author: "Bob Smith"
    date: "2025-01-16"
    text: "Thanks for sharing this. Very helpful!"
```

**Comment Guidelines**:
- Keep comments constructive and relevant
- Use real dates (when the comment was actually made/received)
- Author names can be real names, usernames, or pseudonyms
- Comments support plain text only (no Markdown)

## 🎨 Customization

### Changing Colors and Themes

Edit the CSS variables in `styles.css`:

```css
:root {
  /* Primary accent color */
  --primary-color: #06b6d4; /* Change this to your preferred color */
  --primary-hover: #0891b2;
  
  /* You can also customize: */
  --text-primary: #1f2937;
  --bg-primary: #ffffff;
  /* ... and many more */
}
```

### Updating Site Information

**Blog Title and Subtitle**: Edit the hero section in `index.html`:

```html
<h1 class="hero-title">ctrl alt debug</h1>
<p class="hero-subtitle">A minimal tech blog about debugging life, one line at a time</p>
```

**Navigation**: Update the nav logo in all HTML files:

```html
<a href="index.html" class="nav-logo">ctrl alt debug</a>
```

**Footer**: Modify the footer in all HTML files:

```html
<p>&copy; 2025 ctrl alt debug. Built with ❤️ and vanilla JS.</p>
```

### Adding Custom Fonts

The site uses Inter and JetBrains Mono from Google Fonts. To change fonts, update the `<link>` tags in all HTML files and the CSS variables:

```css
:root {
  --font-family: 'Your-Font', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Your-Mono-Font', 'Fira Code', Consolas, monospace;
}
```

## 🔧 Advanced Configuration

### Posts Per Page

Change the pagination in `script.js`:

```javascript
const postsPerPage = 10; // Change this number
```

### Search Behavior

Modify search sensitivity in the `handleSearch` function in `script.js`:

```javascript
// Current: searches title, excerpt, and tags
return post.title.toLowerCase().includes(query) ||
       post.excerpt.toLowerCase().includes(query) ||
       post.tags.some(tag => tag.toLowerCase().includes(query));
```

### Date Format

Change how dates are displayed by modifying the `formatDate` function in `script.js`:

```javascript
return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',    // Change to 'short' or 'numeric'
    day: 'numeric'
});
```

## 📁 File Structure

```
ctrl-alt-debug/
├── index.html          # Homepage
├── archive.html        # All posts page
├── post.html          # Individual post template
├── styles.css         # All styling
├── script.js          # All functionality
├── posts/             # Your blog posts
│   ├── index.json     # Post metadata
│   ├── 2025-01-15-debugging-wearables.md
│   ├── 2025-01-10-async-javascript-patterns.md
│   └── 2025-01-05-rust-memory-safety.md
└── README.md          # This file
```

## 🌐 GitHub Pages Setup

1. **Go to your repository settings**
2. **Scroll to "Pages" section**
3. **Select source**: Deploy from a branch
4. **Choose branch**: `main` (or `master`)
5. **Choose folder**: `/ (root)`
6. **Save**

Your site will be available at: `https://yourusername.github.io/repository-name`

## 🐛 Troubleshooting

### Posts Not Showing Up

1. **Check `posts/index.json`** - ensure the entry exists and path is correct
2. **Verify file names** - ensure the Markdown file exists at the specified path
3. **Check date format** - use ISO 8601: `2025-01-15T14:30:00Z`
4. **Look at browser console** - check for JavaScript errors

### Search Not Working

1. **Check browser console** for JavaScript errors
2. **Verify `posts/index.json`** is valid JSON (use a JSON validator)
3. **Ensure all required fields** are present in each post entry

### Styling Issues

1. **Check CSS file path** in HTML files
2. **Verify CSS variables** are properly defined
3. **Test in different browsers** - some features require modern browsers

### Comments Not Displaying

1. **Check YAML frontmatter** syntax in your Markdown files
2. **Ensure proper indentation** in the comments array
3. **Verify comment structure** - each comment needs `author`, `date`, and `text`

## 🚀 Performance Tips

- **Optimize images**: Use compressed images or SVGs when possible
- **Limit post length**: Very long posts may slow down the archive page
- **Monitor bundle size**: The site loads all post metadata at once
- **Use CDN fonts**: Google Fonts are already optimized and cached

## 🔒 Security Notes

- **No server-side code**: Everything runs in the browser
- **No user input**: Comments are author-controlled, preventing spam/abuse
- **Static hosting**: Minimal attack surface compared to dynamic sites
- **HTTPS**: GitHub Pages provides HTTPS by default

## 📱 Browser Support

- **Modern browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile**: iOS Safari 12+, Chrome Mobile 60+
- **Features used**: CSS Grid, Flexbox, ES6+, Fetch API, AbortController

## 🤝 Contributing

This is a template repository. Feel free to:

- **Fork and customize** for your own blog
- **Submit issues** for bugs or feature requests
- **Share improvements** via pull requests
- **Star the repo** if you find it useful!

## 📄 License

MIT License - feel free to use this for personal or commercial projects.

---

**Happy blogging!** 🎉

For questions or issues, please open a GitHub issue or check the troubleshooting section above.