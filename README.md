# Blog with Static Comments

A simple, elegant blog system with static comments stored directly in markdown files.

## Features

- **Static Comments**: Comments are stored directly in markdown files, making them permanent and easy to manage
- **Easy Comment Management**: Add comments by editing the markdown files directly
- **Dark Theme**: Beautiful dark theme with smooth animations
- **Responsive Design**: Works great on all devices
- **Fast Loading**: No external dependencies for comments

## Adding Comments to Posts

To add comments to a blog post, edit the markdown file and add a `Comments:` section after the tags:

```markdown
# Your Blog Post Title

Tags: tag1, tag2, tag3

Comments:
- author: "John Doe"
  date: "2 hours ago"
  text: "This is a great post! Thanks for sharing."
  likes: 15
- author: "Jane Smith"
  date: "1 day ago"
  text: "Very helpful information. I learned a lot from this."
  likes: 8
```

## Comment Format

Each comment should follow this YAML-like structure:
- `author`: The commenter's name (in quotes)
- `date`: When the comment was posted (in quotes)
- `text`: The comment content (in quotes)
- `likes`: Number of likes (integer, no quotes)

## File Structure

```
blawg/
├── index.html          # Main HTML file
├── script.js           # JavaScript functionality
├── styles.css          # CSS styles
├── posts/              # Blog posts directory
│   ├── post1.md        # Individual blog posts
│   └── post2.md
└── README.md           # This file
```

## Running the Blog

1. Open a terminal in the blog directory
2. Start a local server: `python -m http.server 8000`
3. Open your browser to `http://localhost:8000`

## Customization

- Edit `styles.css` to change colors, fonts, and layout
- Modify `script.js` to add new functionality
- Update the posts in the `posts/` directory

The blog automatically parses markdown files and displays comments inline with each post.