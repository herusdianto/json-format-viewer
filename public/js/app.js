/**
 * JSON Format Viewer
 * View JSON as Table, Tree, Pretty & Minified
 */

class JSONViewer {
    constructor() {
        this.jsonData = null;
        this.init();
    }

    init() {
        this.bindThemeToggle();
        this.bindTabEvents();
        this.bindInputEvents();
        this.bindActionButtons();
        this.bindCopyButtons();
        this.bindDownloadButtons();
        this.bindTreeControls();
    }

    // ==================== Theme Toggle ====================
    bindThemeToggle() {
        const themeSwitch = document.getElementById('theme-switch');

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') === null ? 'dark' : localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }

        this.updateThemeIcon();

        themeSwitch.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
            this.updateThemeIcon();
        });
    }

    updateThemeIcon() {
        const themeIcon = document.getElementById('theme-icon');
        const isDark = document.body.classList.contains('dark-mode');

        if (isDark) {
            themeIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5M17.6859 17.69L18.5 18.5M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>`;
        } else {
            themeIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
        }
    }

    // ==================== Tab Navigation ====================
    bindTabEvents() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;

                // Update buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // ==================== Input Events ====================
    bindInputEvents() {
        // File drop zone
        const dropZone = document.getElementById('json-drop-zone');
        const fileInput = document.getElementById('json-file');

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                this.handleFile(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                this.handleFile(e.target.files[0]);
            }
        });
    }

    handleFile(file) {
        if (!file.name.endsWith('.json') && file.type !== 'application/json') {
            this.showStatus('Please select a JSON file', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('json-input').value = e.target.result;
            this.showStatus(`File "${file.name}" loaded`, 'success');
            this.formatJSON(); // Auto trigger after file loaded
        };
        reader.onerror = () => {
            this.showStatus('Error reading file', 'error');
        };
        reader.readAsText(file);
    }

    // ==================== Action Buttons ====================
    bindActionButtons() {
        // Sample button
        document.getElementById('sample-btn').addEventListener('click', () => this.loadSampleJSON());
        // Clear button
        document.getElementById('clear-btn').addEventListener('click', () => this.clearAll());
        // Trigger formatJSON on input change
        document.getElementById('json-input').addEventListener('input', () => this.formatJSON());
    }

    formatJSON() {
        const input = document.getElementById('json-input').value.trim();

        if (!input) {
            this.showError('Please enter JSON data');
            return;
        }

        try {
            this.jsonData = JSON.parse(input);
            this.hideError();

            // Show output section
            document.getElementById('output-section').classList.remove('hidden');

            // Render all views
            this.renderTreeView();
            this.renderTableView();
            this.renderPrettyView();
            this.renderMinifiedView();

            this.showStatus('JSON formatted successfully!', 'success');
        } catch (e) {
            this.showError(`Invalid JSON: ${e.message}`);
            document.getElementById('output-section').classList.add('hidden');
        }
    }

    loadSampleJSON() {
        const sampleData = {
            "name": "JSON Format Viewer",
            "version": "1.0.0",
            "description": "A tool to view and format JSON data",
            "features": ["Tree View", "Table View", "Pretty Format", "Minified Format"],
            "author": {
                "name": "Heru Rusdianto",
                "github": "https://github.com/herusdianto"
            },
            "users": [
                { "id": 1, "name": "Alice", "email": "alice@example.com", "active": true },
                { "id": 2, "name": "Bob", "email": "bob@example.com", "active": false },
                { "id": 3, "name": "Charlie", "email": "charlie@example.com", "active": true }
            ],
            "settings": {
                "theme": "dark",
                "autoFormat": true,
                "maxDepth": null
            },
            "stats": {
                "downloads": 1500,
                "rating": 4.8,
                "reviews": 42
            }
        };
        document.getElementById('json-input').value = JSON.stringify(sampleData, null, 2);
        this.showStatus('Sample JSON loaded', 'success');
        this.formatJSON(); // Trigger output
    }

    clearAll() {
        document.getElementById('json-input').value = '';
        document.getElementById('output-section').classList.add('hidden');
        this.hideError();
        this.jsonData = null;
        this.showStatus('Cleared', 'success');
    }

    // ==================== Tree View ====================
    renderTreeView() {
        const container = document.getElementById('tree-view');
        container.innerHTML = '';

        const tree = this.createTreeNode(this.jsonData, null, true);
        container.appendChild(tree);
    }

    createTreeNode(data, key = null, isRoot = false) {
        const wrapper = document.createElement('div');
        wrapper.className = isRoot ? 'tree-node tree-root' : 'tree-node';

        const item = document.createElement('div');
        item.className = 'tree-item';

        if (data === null) {
            item.innerHTML = this.createKeyValueHTML(key, '<span class="tree-null">null</span>');
        } else if (typeof data === 'boolean') {
            item.innerHTML = this.createKeyValueHTML(key, `<span class="tree-boolean">${data}</span>`);
        } else if (typeof data === 'number') {
            item.innerHTML = this.createKeyValueHTML(key, `<span class="tree-number">${data}</span>`);
        } else if (typeof data === 'string') {
            const escaped = this.escapeHTML(data);
            item.innerHTML = this.createKeyValueHTML(key, `<span class="tree-string">"${escaped}"</span>`);
        } else if (Array.isArray(data)) {
            const count = data.length;
            const toggle = document.createElement('span');
            toggle.className = 'tree-toggle';
            toggle.innerHTML = `<span class="arrow">▼</span> ${key !== null ? `<span class="tree-key">"${key}"</span>: ` : ''}<span class="tree-bracket">[</span><span class="tree-count">${count} items</span><span class="tree-bracket">]</span>`;

            const children = document.createElement('div');
            children.className = 'tree-children';

            data.forEach((val, idx) => {
                children.appendChild(this.createTreeNode(val, idx));
            });

            toggle.addEventListener('click', () => {
                toggle.classList.toggle('collapsed');
                children.classList.toggle('hidden');
            });

            item.appendChild(toggle);
            wrapper.appendChild(item);
            wrapper.appendChild(children);
            return wrapper;
        } else if (typeof data === 'object') {
            const keys = Object.keys(data);
            const count = keys.length;
            const toggle = document.createElement('span');
            toggle.className = 'tree-toggle';
            toggle.innerHTML = `<span class="arrow">▼</span> ${key !== null ? `<span class="tree-key">"${key}"</span>: ` : ''}<span class="tree-bracket">{</span><span class="tree-count">${count} keys</span><span class="tree-bracket">}</span>`;

            const children = document.createElement('div');
            children.className = 'tree-children';

            keys.forEach(k => {
                children.appendChild(this.createTreeNode(data[k], k));
            });

            toggle.addEventListener('click', () => {
                toggle.classList.toggle('collapsed');
                children.classList.toggle('hidden');
            });

            item.appendChild(toggle);
            wrapper.appendChild(item);
            wrapper.appendChild(children);
            return wrapper;
        }

        wrapper.appendChild(item);
        return wrapper;
    }

    createKeyValueHTML(key, valueHTML) {
        if (key !== null) {
            return `<span class="tree-key">"${key}"</span>: ${valueHTML}`;
        }
        return valueHTML;
    }

    // ==================== Table View ====================
    renderTableView() {
        const container = document.getElementById('table-view');
        const infoText = document.getElementById('table-info-text');
        container.innerHTML = '';

        // Check if data is an array of objects
        if (Array.isArray(this.jsonData) && this.jsonData.length > 0 && typeof this.jsonData[0] === 'object' && this.jsonData[0] !== null) {
            infoText.textContent = `Showing ${this.jsonData.length} rows`;
            container.appendChild(this.createTable(this.jsonData));
        } else if (typeof this.jsonData === 'object' && this.jsonData !== null && !Array.isArray(this.jsonData)) {
            // Single object - show as key-value table
            infoText.textContent = 'Object properties';
            container.appendChild(this.createObjectTable(this.jsonData));
        } else {
            infoText.textContent = '';
            container.innerHTML = '<div class="no-table-data">Table view is best for arrays of objects or single objects.<br>Use Tree View for other data types.</div>';
        }
    }

    createTable(data) {
        const table = document.createElement('table');
        table.className = 'json-table';

        // Get all unique keys
        const allKeys = new Set();
        data.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                Object.keys(item).forEach(key => allKeys.add(key));
            }
        });

        const keys = Array.from(allKeys);

        // Create header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>#</th>' + keys.map(k => `<th>${this.escapeHTML(k)}</th>`).join('');
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create body
        const tbody = document.createElement('tbody');
        data.forEach((item, idx) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${idx + 1}</td>` + keys.map(k => {
                const value = item && item[k];
                return `<td>${this.formatTableValue(value)}</td>`;
            }).join('');
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        return table;
    }

    createObjectTable(data) {
        const table = document.createElement('table');
        table.className = 'json-table';

        // Create header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>Key</th><th>Value</th><th>Type</th>';
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create body
        const tbody = document.createElement('tbody');
        Object.keys(data).forEach(key => {
            const value = data[key];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.escapeHTML(key)}</td>
                <td>${this.formatTableValue(value)}</td>
                <td>${this.getValueType(value)}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        return table;
    }

    formatTableValue(value) {
        if (value === null) return '<span class="tree-null">null</span>';
        if (value === undefined) return '<span class="tree-null">undefined</span>';
        if (typeof value === 'boolean') return `<span class="tree-boolean">${value}</span>`;
        if (typeof value === 'number') return `<span class="tree-number">${value}</span>`;
        if (typeof value === 'string') return this.escapeHTML(value);
        if (Array.isArray(value)) return `<span class="table-nested">[Array: ${value.length} items]</span>`;
        if (typeof value === 'object') return `<span class="table-nested">{Object: ${Object.keys(value).length} keys}</span>`;
        return String(value);
    }

    getValueType(value) {
        if (value === null) return 'null';
        if (Array.isArray(value)) return 'array';
        return typeof value;
    }

    // ==================== Pretty View ====================
    renderPrettyView() {
        const output = document.getElementById('pretty-output');
        output.textContent = JSON.stringify(this.jsonData, null, 2);
    }

    // ==================== Minified View ====================
    renderMinifiedView() {
        const output = document.getElementById('minified-output');
        output.textContent = JSON.stringify(this.jsonData);
    }

    // ==================== Tree Controls ====================
    bindTreeControls() {
        document.getElementById('expand-all').addEventListener('click', () => {
            document.querySelectorAll('.tree-toggle').forEach(toggle => {
                toggle.classList.remove('collapsed');
            });
            document.querySelectorAll('.tree-children').forEach(children => {
                children.classList.remove('hidden');
            });
        });

        document.getElementById('collapse-all').addEventListener('click', () => {
            document.querySelectorAll('.tree-toggle').forEach(toggle => {
                toggle.classList.add('collapsed');
            });
            document.querySelectorAll('.tree-children').forEach(children => {
                children.classList.add('hidden');
            });
        });
    }

    // ==================== Copy & Download ====================
    bindCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const target = document.getElementById(targetId);
                const text = target.textContent;

                navigator.clipboard.writeText(text).then(() => {
                    this.showStatus('Copied to clipboard!', 'success');
                }).catch(() => {
                    this.showStatus('Failed to copy', 'error');
                });
            });
        });
    }

    bindDownloadButtons() {
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const contentId = btn.dataset.content;
                const filename = btn.dataset.filename;
                const content = document.getElementById(contentId).textContent;

                const blob = new Blob([content], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                this.showStatus(`Downloaded ${filename}`, 'success');
            });
        });
    }

    // ==================== Helpers ====================
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    hideError() {
        document.getElementById('error-message').classList.add('hidden');
    }

    showStatus(message, type = 'success') {
        const statusDiv = document.getElementById('status-message');
        statusDiv.textContent = message;
        statusDiv.className = `status-message ${type}`;
        statusDiv.classList.remove('hidden');

        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 2500);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new JSONViewer();
});
