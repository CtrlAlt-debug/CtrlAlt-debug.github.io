# Ctrl Alt Debug - Tech Blog

A modern, clean tech blog built with vanilla HTML, CSS, and JavaScript. Features a responsive design with dark/light theme support and markdown post rendering.

## Features

- 🌙 Dark/Light theme toggle
- 📱 Fully responsive design
- 📝 Markdown post support with syntax highlighting
- 💬 Comment system (static comments in markdown frontmatter)
- 🎨 Modern, professional design
- ⚡ Fast loading with no framework dependencies
- 🔍 SEO-friendly structure

## Project Structure

```
blog/
├── index.html          # Main blog page
├── styles.css          # All styling with CSS custom properties
├── script.js           # Blog functionality and post loading
├── posts/              # Markdown posts directory
│   ├── debugging-javascript-like-pro.md
│   ├── modern-css-grid-layouts.md
│   └── react-performance-optimization.md
└── README.md           # This file
```

## Adding New Posts

To add a new blog post:

1. Create a new `.md` file in the `posts/` directory
2. Add frontmatter with the following structure:

```yaml
---
title: "Your Post Title"
date: "YYYY-MM-DD"
tags: ["Tag1", "Tag2", "Tag3"]
excerpt: "A brief description of your post that appears on the homepage."
comments:
  - author: "Commenter Name"
    date: "YYYY-MM-DD"
    content: "Comment content here."
  - author: "Another Commenter"
    date: "YYYY-MM-DD"
    content: "Another comment."
---
```

3. Write your post content in Markdown below the frontmatter
4. The post will automatically appear on the blog homepage

## Post Format Guidelines

### Frontmatter Fields

- **title**: The post title (required)
- **date**: Publication date in YYYY-MM-DD format (required)
- **tags**: Array of tags for categorization (required)
- **excerpt**: Brief description for the homepage preview (required)
- **comments**: Array of comment objects with author, date, and content (optional)

### Markdown Content

- Use standard Markdown syntax
- Code blocks are automatically syntax highlighted
- Images should be optimized for web
- Use semantic heading structure (H1 for title, H2 for main sections, etc.)

## Customization

### Themes

The blog supports light and dark themes using CSS custom properties. Theme colors are defined in the `:root` and `[data-theme="dark"]` selectors in `styles.css`.

### Styling

All styles use CSS custom properties for easy customization:

- `--bg-primary`: Main background color
- `--text-primary`: Primary text color
- `--accent-primary`: Accent color for links and highlights
- And many more...

### Adding New Features

The blog is built with vanilla JavaScript for easy modification. Key areas:

- **Post loading**: Modify the `getSamplePosts()` method in `script.js`
- **Styling**: Update CSS custom properties in `styles.css`
- **Layout**: Modify the HTML structure in `index.html`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- ES6+ JavaScript features used

## Performance

- No external frameworks or heavy dependencies
- Optimized CSS with minimal unused styles
- Lazy loading of post content
- Efficient DOM manipulation

## GitHub Pages Deployment

This blog is designed to work perfectly with GitHub Pages:

1. Push your blog to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Your blog will be available at `https://yourusername.github.io/repository-name`

## License

Feel free to use this blog template for your own projects. No attribution required, but appreciated!

## Contributing

If you find bugs or have suggestions for improvements, feel free to open an issue or submit a pull request.