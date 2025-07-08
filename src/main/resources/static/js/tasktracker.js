// Mock data - zastąp wywołaniami API do bazy Oracle
let tasks = [];
let filteredTasks = [];

// Inicjalizacja strony
document.addEventListener('DOMContentLoaded', function() {
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

        switch(status) {
            case 'TODO':
                acc.todo++;
                break;
            case 'IN_PROGRESS':
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
    }, { todo: 0, progress: 0, done: 0, overdue: 0 });

    document.getElementById('todoCount').textContent = stats.todo;
    document.getElementById('progressCount').textContent = stats.progress;
    document.getElementById('doneCount').textContent = stats.done;
    document.getElementById('overdueCount').textContent = stats.overdue;
}

// Funkcje pomocnicze
function getPriorityText(priority) {
    const priorities = {
        'HIGH': 'Wysoki',
        'MEDIUM': 'Średni',
        'LOW': 'Niski'
    };
    const normalizedPriority = normalizePriority(priority);
    return priorities[normalizedPriority] || 'Średni';
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
        'IN_PROGRESS': 'IN_PROGRESS',
        'PROGRESS': 'IN_PROGRESS',

        'ZAKONCZONE': 'COMPLETED',
        'COMPLETED': 'COMPLETED',
        'DONE': 'COMPLETED',
        'FINISHED': 'COMPLETED',

        'PRZETERMINOWANE': 'OUTDATED',
        'OUTDATED': 'OUTDATED',
        'DELAYED': 'OUTDATED'
    };

    return statusMap[status] || status;
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
    switch(normalizedStatus) {
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
    switch(normalizedPriority) {
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
    switch(normalizedPriority) {
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

// Akcje na zadaniach - TODO: Implementuj wywołania API
function addNewTask() {
    // TODO: Otwórz modal/formularz dodawania nowego zadania
    alert('Funkcjonalność dodawania zadań - do implementacji');
}

function editTask(taskId) {
    // TODO: Otwórz modal/formularz edycji zadania
    alert(`Edycja zadania ID: ${taskId} - do implementacji`);
}

function completeTask(taskId) {
    // TODO: Wywołaj API do oznaczenia zadania jako ukończone
    if (confirm('Czy na pewno chcesz oznaczyć to zadanie jako ukończone?')) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = 'COMPLETED';
            filterTasks();
        }
    }
}

function deleteTask(taskId) {
    // TODO: Wywołaj API do usunięcia zadania
    if (confirm('Czy na pewno chcesz usunąć to zadanie?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        filterTasks();
    }
}

// Skróty klawiszowe
document.addEventListener('keydown', function(e) {
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