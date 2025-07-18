let tasks = [];
let filteredTasks = [];

// Inicjalizacja strony
document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
    setupEventListeners();
});

// Ustawienie event listenerów
function setupEventListeners() {
    const searchBox = document.getElementById('searchTasks');
    const statusFilter = document.getElementById('filterStatus');
    const priorityFilter = document.getElementById('filterPriority');

    searchBox.addEventListener('input', debounce(filterTasks, 300));
    statusFilter.addEventListener('change', filterTasks);
    priorityFilter.addEventListener('change', filterTasks);
}

// Debounce function dla wyszukiwania
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

// Ładowanie zadań z backendu Spring Boot
async function loadTasks() {
    showLoading(true);

    try {
        const response = await fetch('/api/tasks'); // <- wywołanie do kontrolera w Springu
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        tasks = await response.json();
        filteredTasks = [...tasks];

        renderTasks();
        updateStatistics();

    } catch (error) {
        console.error('Błąd podczas ładowania zadań:', error);
        showError('Nie udało się załadować zadań. Spróbuj odświeżyć stronę.');
    } finally {
        showLoading(false);
    }
}

// Renderowanie listy zadań
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');

    // Sprawdzanie czy filteredTasks istnieje
    if (!filteredTasks || filteredTasks.length === 0) {
        taskList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    taskList.style.display = 'flex';
    emptyState.style.display = 'none';

    taskList.innerHTML = filteredTasks.map(task => {
        // Sprawdzanie czy task istnieje
        if (!task) return '';

        // Bezpieczne pobieranie wartości z możliwymi wartościami domyślnymi
        const taskId = task.id || task.task_id || 0;
        const title = task.title || 'Brak tytułu';
        const description = task.description || 'Brak opisu';
        const priority = task.priority || 'MEDIUM';
        const status = task.status || 'TODO';
        const createdDate = task.createdDate || task.creationDate || new Date().toISOString();
        const dueDate = task.dueDate || new Date().toISOString();

        return `
            <div class="task-item" data-task-id="${taskId}">
                <div class="task-header">
                    <div class="task-title">${escapeHtml(title)}</div>
                    <div class="task-priority ${getPriorityClassName(priority)}">
                        ${getPriorityText(priority)}
                        <span class="priority-icon">${getPriorityIcon(priority)}</span>
                    </div>
                </div>
                <div class="task-description">${escapeHtml(description)}</div>
                <div class="task-meta">
                    <div class="task-dates">
                        <span>📅 Added: ${formatDate(createdDate)}</span>
                        <span>⏰ Deadline: ${formatDate(dueDate)}</span>
                    </div>
                    <div class="task-status ${getStatusClassName(status)}">${getStatusText(status)}</div>
                </div>
                <div class="task-actions">
                    <button class="action-btn btn-edit" onclick="editTask(${taskId})">✏️ Edit</button>
                    ${status !== 'COMPLETED' ? `<button class="action-btn btn-complete" onclick="completeTask(${taskId})">✅ End</button>` : ''}
                    <button class="action-btn btn-delete" onclick="deleteTask(${taskId})">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Funkcja pomocnicza do eskejpowania HTML
function escapeHtml(unsafe) {
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// Filtrowanie zadań
function filterTasks() {
    const searchTerm = document.getElementById('searchTasks').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    const priorityFilter = document.getElementById('filterPriority').value;

    filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' ||
            normalizeStatus(task.status) === normalizeStatus(statusFilter);
        const matchesPriority = priorityFilter === 'all' ||
            normalizePriority(task.priority) === normalizePriority(priorityFilter);

        return matchesSearch && matchesStatus && matchesPriority;
    });

    renderTasks();
    updateStatistics();
}

// Aktualizacja statystyk
function updateStatistics() {
    const stats = filteredTasks.reduce((acc, task) => {
        const status = task.status?.toUpperCase();

        switch (status) {
            case 'TODO':
                acc.todo++;
                break;
            case 'IN PROGRESS':
                acc.progress++;
                break;
            case 'DONE':
                acc.done++;
                break;
            case 'OUTDATED':
                acc.overdue++;
                break;
            default:
                acc.todo++; // domyślnie traktujemy jako todo
        }
        return acc;
    }, {todo: 0, progress: 0, done: 0, overdue: 0});

    document.getElementById('todoCount').textContent = stats.todo;
    document.getElementById('progressCount').textContent = stats.progress;
    document.getElementById('doneCount').textContent = stats.done;
    document.getElementById('overdueCount').textContent = stats.overdue;
}

// Funkcje pomocnicze
function getPriorityText(priority) {
    const priorities = {
        'HIGH': 'High',
        'MEDIUM': 'Medium',
        'LOW': 'Low'
    };
    const normalizedPriority = normalizePriority(priority);
    return priorities[normalizedPriority] || 'Medium';
}

function getStatusText(status) {
    const statuses = {
        'TODO': 'Do wykonania',
        'IN_PROGRESS': 'W trakcie',
        'COMPLETED': 'Zakończone',
        'OUTDATED': 'Przeterminowane'
    };
    return statuses[status] || status;
}

function normalizeStatus(status) {
    // Konwertuj do wielkiech liter i usuń spacje
    status = status.toUpperCase().trim();

    // Mapowanie różnych możliwych wartości na standardowe statusy
    const statusMap = {
        'DO_ZROBIENIA': 'TODO',
        'NOWE': 'TODO',
        'NEW': 'TODO',

        'W_TRAKCIE': 'IN_PROGRESS',
        'IN PROGRESS': 'IN_PROGRESS',
        'PROGRESS': 'IN_PROGRESS',

        'ZAKONCZONE': 'COMPLETED',
        'COMPLETED': 'COMPLETED',
        'DONE': 'COMPLETED',
        'FINISHED': 'COMPLETED',

        'PRZETERMINOWANE': 'OUTDATED',
        'OUTDATED': 'OUTDATED',
        'DELAYED': 'OUTDATED'
    };

    if (statusMap[status]) {
        return statusMap[status];
    }

    const standardStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'OUTDATED'];
    if (standardStatuses.includes(status)) {
        return status;
    }

    return 'TODO';

}

function normalizePriority(priority) {
    priority = (priority || '').toUpperCase().trim();

    const priorityMap = {
        'WYSOKI': 'HIGH',
        'ŚREDNI': 'MEDIUM',
        'NISKI': 'LOW',
        'HIGH': 'HIGH',
        'MEDIUM': 'MEDIUM',
        'LOW': 'LOW'
    };

    return priorityMap[priority] || 'MEDIUM'; // domyślnie MEDIUM
}

function getStatusClassName(status) {
    const normalizedStatus = normalizeStatus(status);
    switch (normalizedStatus) {
        case 'TODO':
            return 'status-todo';
        case 'IN_PROGRESS':
            return 'status-progress';
        case 'COMPLETED':
            return 'status-done';
        case 'OUTDATED':
            return 'status-outdated';
        default:
            return 'status-todo'; // default status
    }
}

function getPriorityClassName(priority) {
    const normalizedPriority = normalizePriority(priority);
    switch (normalizedPriority) {
        case 'HIGH':
            return 'priority-high';
        case 'MEDIUM':
            return 'priority-medium';
        case 'LOW':
            return 'priority-low';
        default:
            return 'priority-medium';
    }
}

function getPriorityIcon(priority) {
    const normalizedPriority = normalizePriority(priority);
    switch (normalizedPriority) {
        case 'HIGH':
            return '🔴';
        case 'MEDIUM':
            return '🟡';
        case 'LOW':
            return '🟢';
        default:
            return '⚪';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
}

function showLoading(show) {
    const loadingState = document.getElementById('loadingState');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');

    if (show) {
        loadingState.style.display = 'flex';
        taskList.style.display = 'none';
        emptyState.style.display = 'none';
    } else {
        loadingState.style.display = 'none';
    }
}

function showError(message) {
    // TODO: Implementuj wyświetlanie błędów
    alert(message);
}

async function addNewTask() {

    const modal = document.getElementById('taskModal');
    const closeButtons = document.getElementsByClassName('close-modal');
    const form = document.getElementById('taskForm');

    modal.style.display = 'block';

    Array.from(closeButtons).forEach(button => {
        button.onclick = () => {
            modal.style.display = 'none';
        }
    });

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    form.onsubmit = async (e) => {
        e.preventDefault();

        const title = document.getElementById('taskTitle').value.trim();
        if (!title) {
            alert('Title is required!');
            return;
        }

        const formData = {
            title: title,
            description: document.getElementById('taskDescription').value.trim() || '',
            priority: document.getElementById('taskPriority').value,
            dueDate: document.getElementById('taskDueDate').value
        };

        try {
            showLoading(true);

            // Pobieranie tokenów CSRF
            const token = document.querySelector('meta[name="_csrf"]').getAttribute('content');
            const header = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

            const headers = {
                'Content-Type': 'application/json',
                [header]: token
            };


            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`Server error: ${response.status}. Details: ${errorText}`);
            }

            const newTask = await response.json();
            tasks.push(newTask);
            filterTasks();

            modal.style.display = 'none';
            form.reset();

            alert('Task has been added successfully!');

        } catch (error) {
            console.error('Error details', error);
            alert(`Error: ${error.message}`);
        } finally {
            showLoading(false);
        }
    };
}

function editTask(taskId) {

    const task = tasks.find(t => t.id === taskId || t.task_id === taskId);

    if (!task) {
        alert('Nie znaleziono zadania o podanym ID');
        return;
    }

    renderEditTaskModal(task);
}

function renderEditTaskModal(task) {
    const modal = document.getElementById('editTaskModal');
    const taskId = task.id || task.task_id;
    const title = task.title || '';
    const description = task.description || '';
    const priority = normalizePriority(task.priority) || 'MEDIUM';
    const dueDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';

    modal.innerHTML = `
        <div class="modal-content" style="max-height: 80vh; overflow-y: auto;">
            <div class="modal-header">
                <h2>Edit Task</h2>
                <span class="close-modal">&times;</span>
            </div>
            <form id="editTaskForm" class="modal-form">
                <div class="form-group">
                    <label for="editTaskTitle">Title</label>
                    <input type="text" id="editTaskTitle" name="title" required value="${title}">
                </div>

                <div class="form-group">
                    <label for="editTaskDescription">Description</label>
                    <textarea id="editTaskDescription" name="description" rows="3">${description}</textarea>
                </div>

                <div class="form-group">
                    <label for="editTaskPriority">Priority</label>
                    <select id="editTaskPriority" name="priority">
                        ${['LOW', 'MEDIUM', 'HIGH'].map(p =>
        `<option value="${p}" ${p === priority ? 'selected' : ''}>${p.charAt(0) + p.slice(1).toLowerCase()}</option>`
    ).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="editTaskStatus">Status</label>
                    <select id="editTaskStatus" name="status">
                        ${['TO DO', 'IN PROGRESS'].map(p =>
        `<option value="${p}" ${p === priority ? 'selected' : ''}>${p.charAt(0) + p.slice(1).toLowerCase()}</option>`
    ).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label for="editTaskDueDate">Due date:</label>
                    <input type="date" id="editTaskDueDate" name="dueDate" value="${dueDate}">
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn-secondary close-modal">Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    `;

    modal.style.display = 'block';

    // Obsługa zamykania modala
    modal.querySelectorAll('.close-modal').forEach(btn => {
        btn.onclick = () => modal.style.display = 'none';
    });
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };

    const form = modal.querySelector('#editTaskForm');
    form.onsubmit = async (e) => {
        e.preventDefault();

        const updatedTitle = form.elements.title.value.trim();
        if (!updatedTitle) {
            alert('Title is required!');
            return;
        }

        const updatedTask = {
            id: taskId,
            title: updatedTitle,
            description: form.elements.description.value.trim() || '',
            priority: form.elements.priority.value,
            status: form.elements.status.value,
            dueDate: form.elements.dueDate.value
        };

        try {
            showLoading(true);

            const token = document.querySelector('meta[name="_csrf"]').getAttribute('content');
            const header = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    [header]: token
                },
                body: JSON.stringify(updatedTask)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status}. Details: ${errorText}`);
            }

            const responseText = await response.text();
            let serverResponse;

            try {
                serverResponse = JSON.parse(responseText);
            } catch (err) {
                throw new Error('Server returned invalid JSON');
            }

            const updatedTaskFromServer = {
                id: serverResponse.id,
                title: serverResponse.title || '',
                description: serverResponse.description || '',
                priority: serverResponse.currentPriority?.priorityName?.toUpperCase() ||
                    serverResponse.priority?.toUpperCase() || 'MEDIUM',
                dueDate: serverResponse.dueDate || '',
                creationDate: serverResponse.creationDate || null,
                completionDate: serverResponse.completionDate || null,
                status: serverResponse.currentStatus?.name || serverResponse.status?.name || 'to do'
            };

            const index = tasks.findIndex(t => (t.id || t.task_id) === taskId);
            if (index !== -1) tasks[index] = updatedTaskFromServer;

            filterTasks();
            modal.style.display = 'none';
            alert('Task has been updated successfully!');
        } catch (error) {
            console.error('Error updating task:', error);
            alert(`Error: ${error.message}`);
        } finally {
            showLoading(false);
        }
    };
}

function completeTask(taskId) {
    // TODO: Wywołaj API do oznaczenia zadania jako ukończone
    renderTasks()
}

function deleteTask(taskId) {
    // TODO: Wywołaj API do usunięcia zadania
    if (confirm('Czy na pewno chcesz usunąć to zadanie?')) {
        renderTasks()
    }
}

// Skróty klawiszowe
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + K = Wyszukiwanie zadań
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchTasks').focus();
    }

    // Ctrl/Cmd + N = Dodanie nowego zadania
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        addNewTask();
    }
});