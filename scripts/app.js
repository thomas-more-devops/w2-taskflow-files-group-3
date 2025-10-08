class TaskFlow {
    constructor() {
        this.tasks = this.loadTasks();
        this.taskIdCounter = this.getNextTaskId();
<<<<<<< HEAD
        this.currentFilter = 'all';
        this.currentSort = 'created-desc';
        this.searchQuery = '';
=======
        this.currentCategoryFilter = 'all';
>>>>>>> origin/main
        this.initializeApp();
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
    }

    initializeApp() {
        console.log('TaskFlow initialized successfully!');
        this.showWelcomeMessage();
    }

    showWelcomeMessage() {
        if (this.tasks.length === 0) {
            console.log('Welcome to TaskFlow! Add your first task to get started.');
        }
    }

    bindEvents() {
        const addTaskBtn = document.getElementById('addTaskBtn');
        const taskInput = document.getElementById('taskInput');
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        const sortSelect = document.getElementById('sortSelect');
        const toggleAdvanced = document.getElementById('toggleAdvanced');
        const clearAllFilters = document.getElementById('clearAllFilters');

        addTaskBtn.addEventListener('click', () => this.addTask());

        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

<<<<<<< HEAD
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderTasks();
            this.updateSearchResults();
        });

        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            this.searchQuery = '';
            this.renderTasks();
            this.updateSearchResults();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Sort functionality
        sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderTasks();
        });

        // Advanced panel toggle
        toggleAdvanced.addEventListener('click', () => {
            this.toggleAdvancedPanel();
        });

        // Clear all filters
        clearAllFilters.addEventListener('click', () => {
            this.clearAllFilters();
        });

=======
        // Category filter buttons
        document.querySelectorAll('.category-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setCategoryFilter(e.target.dataset.category);
            });
        });

>>>>>>> origin/main
        // Focus on input when page loads
        taskInput.focus();
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const categorySelect = document.getElementById('categorySelect');
        const taskText = taskInput.value.trim();
        const category = categorySelect.value;

        if (taskText === '') {
            this.showNotification('Please enter a task description', 'warning');
            taskInput.focus();
            return;
        }

        const newTask = {
            id: this.taskIdCounter++,
            text: taskText,
            category: category,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        taskInput.value = '';
        categorySelect.value = 'personal';
        taskInput.focus();

        this.showNotification('Task added successfully!', 'success');
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showNotification('Task deleted successfully!', 'success');
        }
    }

    toggleTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();

            const message = task.completed ? 'Task completed! 🎉' : 'Task marked as pending';
            this.showNotification(message, 'success');
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            const newText = prompt('Edit task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                this.saveTasks();
                this.renderTasks();
                this.showNotification('Task updated successfully!', 'success');
            }
        }
    }

<<<<<<< HEAD
    setFilter(filter) {
        this.currentFilter = filter;

        // Update button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        this.renderTasks();
        this.updateSearchResults();
    }

    toggleAdvancedPanel() {
        const panel = document.getElementById('advancedPanel');
        const toggleIcon = document.querySelector('.toggle-icon');

        if (panel.style.display === 'none' || !panel.style.display) {
            panel.style.display = 'block';
            toggleIcon.textContent = '▲';
        } else {
            panel.style.display = 'none';
            toggleIcon.textContent = '▼';
        }
    }

    clearAllFilters() {
        // Reset search
        document.getElementById('searchInput').value = '';
        this.searchQuery = '';

        // Reset filters
        this.setFilter('all');

        // Reset sort
        this.currentSort = 'created-desc';
        document.getElementById('sortSelect').value = 'created-desc';

        this.renderTasks();
        this.updateSearchResults();
        this.showNotification('All filters cleared', 'info');
    }

    matchesSearch(task) {
        if (!this.searchQuery) return true;
        return task.text.toLowerCase().includes(this.searchQuery);
    }

    matchesFilter(task) {
        const now = new Date();
        const today = now.toDateString();
        const taskCreated = new Date(task.createdAt);
        const isRecent = (now - taskCreated) < (24 * 60 * 60 * 1000); // Last 24 hours

        switch (this.currentFilter) {
            case 'all':
                return true;
            case 'completed':
                return task.completed;
            case 'pending':
                return !task.completed;
            case 'recent':
                return isRecent;
            default:
                return true;
        }
    }

    getFilteredTasks() {
        return this.tasks.filter(task =>
            this.matchesSearch(task) && this.matchesFilter(task)
        );
    }

    getSortedTasks(tasks) {
        const sortedTasks = [...tasks];

        switch (this.currentSort) {
            case 'created-desc':
                return sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'created-asc':
                return sortedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'alphabetical':
                return sortedTasks.sort((a, b) => a.text.localeCompare(b.text));
            case 'completion':
                return sortedTasks.sort((a, b) => {
                    if (a.completed !== b.completed) {
                        return a.completed - b.completed;
                    }
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
            default:
                return sortedTasks;
        }
    }

    highlightSearchTerm(text) {
        if (!this.searchQuery) return this.escapeHtml(text);

        const regex = new RegExp(`(${this.escapeRegex(this.searchQuery)})`, 'gi');
        const escapedText = this.escapeHtml(text);
        return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    updateSearchResults() {
        const searchResults = document.getElementById('searchResults');
        const filteredTasks = this.getFilteredTasks();
        const totalTasks = this.tasks.length;

        if (this.searchQuery || this.currentFilter !== 'all') {
            searchResults.textContent = `Showing ${filteredTasks.length} of ${totalTasks}`;
            searchResults.style.display = 'inline';
        } else {
            searchResults.style.display = 'none';
        }
=======
    setCategoryFilter(category) {
        this.currentCategoryFilter = category;

        // Update button states
        document.querySelectorAll('.category-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        this.renderTasks();
    }

    matchesCategoryFilter(task) {
        if (this.currentCategoryFilter === 'all') {
            return true;
        }
        return task.category === this.currentCategoryFilter;
    }

    getFilteredTasks() {
        return this.tasks.filter(task => this.matchesCategoryFilter(task));
    }

    getCategoryIcon(category) {
        const icons = {
            work: '💼',
            personal: '📝',
            shopping: '🛒',
            health: '🏥',
            study: '📚'
        };
        return icons[category] || '📝';
    }

    getCategoryColor(category) {
        const colors = {
            work: '#3182ce',
            personal: '#38a169',
            shopping: '#ed8936',
            health: '#e53e3e',
            study: '#805ad5'
        };
        return colors[category] || '#38a169';
>>>>>>> origin/main
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
<<<<<<< HEAD
        const noResults = document.getElementById('noResults');
        const filteredTasks = this.getFilteredTasks();
        const sortedTasks = this.getSortedTasks(filteredTasks);

        // Hide both states initially
        emptyState.style.display = 'none';
        noResults.style.display = 'none';

        if (this.tasks.length === 0) {
            // No tasks at all
=======
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
>>>>>>> origin/main
            tasksList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        if (sortedTasks.length === 0) {
            // Tasks exist but none match filters
            tasksList.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

<<<<<<< HEAD
        // Show tasks
        tasksList.style.display = 'flex';
=======
        // Sort tasks: incomplete first, then by category, then by creation date
        const sortedTasks = [...filteredTasks].sort((a, b) => {
            // First sort by completion status
            if (a.completed !== b.completed) {
                return a.completed - b.completed;
            }

            // Then sort by category
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }

            // Finally sort by creation date (newest first)
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
>>>>>>> origin/main

        tasksList.innerHTML = sortedTasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''} category-${task.category}" data-task-id="${task.id}">
                <div class="task-content">
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}"
                         onclick="taskFlow.toggleTask(${task.id})">
                    </div>
<<<<<<< HEAD
                    <span class="task-text">${this.highlightSearchTerm(task.text)}</span>
                    <span class="task-meta">
                        ${new Date(task.createdAt).toLocaleDateString()}
=======
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                    <span class="category-badge category-${task.category}" style="background-color: ${this.getCategoryColor(task.category)}">
                        ${this.getCategoryIcon(task.category)} ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}
>>>>>>> origin/main
                    </span>
                </div>
                <div class="task-actions">
                    <button class="task-btn edit-btn" onclick="taskFlow.editTask(${task.id})" title="Edit task">
                        ✏️
                    </button>
                    <button class="task-btn delete-btn" onclick="taskFlow.deleteTask(${task.id})" title="Delete task">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');

        this.updateSearchResults();
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
<<<<<<< HEAD
        const filteredTasks = this.getFilteredTasks().length;
=======
        const categoriesUsed = new Set(this.tasks.map(task => task.category)).size;
>>>>>>> origin/main

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
<<<<<<< HEAD
        document.getElementById('filteredTasks').textContent = filteredTasks;
=======
        document.getElementById('categoriesUsed').textContent = categoriesUsed;
>>>>>>> origin/main

        // Update task count in header
        const taskCount = document.getElementById('taskCount');
        taskCount.textContent = `${totalTasks} ${totalTasks === 1 ? 'task' : 'tasks'}`;

        // Update category statistics
        this.updateCategoryStats();
    }

    updateCategoryStats() {
        const categoryStats = document.getElementById('categoryStats');
        const categories = ['work', 'personal', 'shopping', 'health', 'study'];

        const categoryData = categories.map(category => {
            const total = this.tasks.filter(task => task.category === category).length;
            const completed = this.tasks.filter(task => task.category === category && task.completed).length;
            const pending = total - completed;

            return {
                category,
                total,
                completed,
                pending,
                icon: this.getCategoryIcon(category),
                color: this.getCategoryColor(category)
            };
        }).filter(data => data.total > 0);

        categoryStats.innerHTML = categoryData.map(data => `
            <div class="category-stat-item">
                <div class="category-stat-header">
                    <span class="category-icon">${data.icon}</span>
                    <span class="category-name">${data.category.charAt(0).toUpperCase() + data.category.slice(1)}</span>
                    <span class="category-total">${data.total}</span>
                </div>
                <div class="category-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${data.total ? (data.completed / data.total) * 100 : 0}%; background-color: ${data.color}"></div>
                    </div>
                    <span class="progress-text">${data.completed}/${data.total} completed</span>
                </div>
            </div>
        `).join('');

        if (categoryData.length === 0) {
            categoryStats.innerHTML = '<p class="no-categories">No tasks with categories yet.</p>';
        }
    }

    saveTasks() {
        try {
            localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
            localStorage.setItem('taskflow_counter', this.taskIdCounter.toString());
        } catch (error) {
            console.error('Failed to save tasks:', error);
            this.showNotification('Failed to save tasks. Please check your browser storage.', 'error');
        }
    }

    loadTasks() {
        try {
            const saved = localStorage.getItem('taskflow_tasks');
            const tasks = saved ? JSON.parse(saved) : [];

            // Add default category to existing tasks for backward compatibility
            return tasks.map(task => ({
                ...task,
                category: task.category || 'personal'
            }));
        } catch (error) {
            console.error('Failed to load tasks:', error);
            return [];
        }
    }

    getNextTaskId() {
        try {
            const saved = localStorage.getItem('taskflow_counter');
            return saved ? parseInt(saved) : 1;
        } catch (error) {
            console.error('Failed to load task counter:', error);
            return 1;
        }
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        console.log(`[${type.toUpperCase()}] ${message}`);

        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            max-width: 300px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        `;

        // Set color based on type
        const colors = {
            success: '#48bb78',
            error: '#e53e3e',
            warning: '#ed8936',
            info: '#3182ce'
        };

        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Utility methods for potential future features
    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'taskflow_backup.json';
        link.click();

        URL.revokeObjectURL(url);
        this.showNotification('Tasks exported successfully!', 'success');
    }

    clearAllTasks() {
        if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
            this.tasks = [];
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showNotification('All tasks cleared!', 'success');
        }
    }

    getTaskStats() {
        const now = new Date();
        const categoryBreakdown = {};

        ['work', 'personal', 'shopping', 'health', 'study'].forEach(category => {
            categoryBreakdown[category] = {
                total: this.tasks.filter(t => t.category === category).length,
                completed: this.tasks.filter(t => t.category === category && t.completed).length,
                pending: this.tasks.filter(t => t.category === category && !t.completed).length
            };
        });

        const stats = {
            total: this.tasks.length,
            completed: this.tasks.filter(t => t.completed).length,
            pending: this.tasks.filter(t => !t.completed).length,
<<<<<<< HEAD
            filtered: this.getFilteredTasks().length,
            searchQuery: this.searchQuery,
            currentFilter: this.currentFilter,
            currentSort: this.currentSort,
=======
            categoriesUsed: new Set(this.tasks.map(t => t.category)).size,
            categoryBreakdown,
>>>>>>> origin/main
            createdToday: this.tasks.filter(t => {
                const taskDate = new Date(t.createdAt);
                return taskDate.toDateString() === now.toDateString();
            }).length,
            completedToday: this.tasks.filter(t => {
                if (!t.completedAt) return false;
                const completedDate = new Date(t.completedAt);
                return completedDate.toDateString() === now.toDateString();
            }).length,
            recent: this.tasks.filter(t => {
                const taskCreated = new Date(t.createdAt);
                return (now - taskCreated) < (24 * 60 * 60 * 1000);
            }).length
        };
        return stats;
    }

    // Advanced search functionality
    searchByKeyword(keyword) {
        this.searchQuery = keyword.toLowerCase();
        document.getElementById('searchInput').value = keyword;
        this.renderTasks();
        this.updateSearchResults();
    }

    // Bulk operations
    markAllCompleted() {
        const filteredTasks = this.getFilteredTasks();
        const pendingTasks = filteredTasks.filter(task => !task.completed);

        if (pendingTasks.length === 0) {
            this.showNotification('No pending tasks to complete', 'info');
            return;
        }

        pendingTasks.forEach(task => {
            task.completed = true;
            task.completedAt = new Date().toISOString();
        });

        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.showNotification(`Marked ${pendingTasks.length} tasks as completed`, 'success');
    }

    deleteCompleted() {
        const completedTasks = this.tasks.filter(task => task.completed);

        if (completedTasks.length === 0) {
            this.showNotification('No completed tasks to delete', 'info');
            return;
        }

        if (confirm(`Delete ${completedTasks.length} completed tasks? This cannot be undone.`)) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showNotification(`Deleted ${completedTasks.length} completed tasks`, 'success');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskFlow = new TaskFlow();
});

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskFlow;
}