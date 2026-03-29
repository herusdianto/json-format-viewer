# JSON Format Viewer

A client-side web tool for viewing and formatting JSON data. View JSON as Table, Tree, Pretty and Minified format.

**100% Client-side - No data sent to server!**

## Features

- ✅ Tree View - Interactive collapsible tree with syntax highlighting
- ✅ Table View - View array of objects as table
- ✅ Pretty Format - Beautified JSON with indentation
- ✅ Minified Format - Compact JSON for production
- ✅ Drag & drop JSON file support
- ✅ Copy to clipboard
- ✅ Download formatted JSON
- ✅ Sample JSON data
- ✅ JSON validation with error messages
- ✅ Dark mode UI
- ✅ Responsive design

## Views

| View | Description |
|------|-------------|
| Tree View | Interactive hierarchical view with expand/collapse |
| Table View | Best for arrays of objects, shows data in rows |
| Pretty | Formatted JSON with 2-space indentation |
| Minified | Compact single-line JSON |

## Usage

### Option 1: Open directly in browser

Simply open `public/index.html` in your web browser.

### Option 2: Use a local server

```bash
# Using Python
cd public && python -m http.server 8000

# Using Node.js
npx serve public

# Using PHP
php -S localhost:8000 -t public
```

Then open `http://localhost:8000` in your browser.

## How to Use

1. **Input JSON**: Paste JSON text or drag & drop a `.json` file
2. **Click "Format & View"** to process the JSON
3. **Switch tabs** to view in different formats:
   - **Tree View**: Expand/collapse nodes, see structure
   - **Table View**: See arrays as tables
   - **Pretty**: Copy or download formatted JSON
   - **Minified**: Copy or download minified JSON

## Project Structure

```
json-format-viewer/
├── public/
│   ├── index.html      # Main HTML file
│   ├── favicon.svg     # Favicon
│   ├── 404.html        # 404 page
│   ├── css/
│   │   └── style.css   # Styles
│   └── js/
│       └── app.js      # Main JavaScript logic
└── README.md           # Documentation
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

