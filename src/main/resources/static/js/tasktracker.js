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

        tasks = await response.json(); // <- prawdziwe dane z backendu
        filteredTasks = [...tasks];

        renderTasks();        // <- rysuj zadania
        updateStatistics();   // <- statystyki jeśli masz

    } catch (error) {
        console.error('Błąd podczas ładowania zadań:', error);
        showError('Nie udało się załadować zadań. Spróbuj odświeżyć stronę.');
    } finally {
        showLoading(false);
    }
}


// Symulacja wywołania API
function simulateApiCall() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

// Generowanie przykładowych danych - usuń gdy dodasz prawdziwe API
function generateMockTasks() {
    return [
        {
            id: 1,
            title: "Przygotowanie prezentacji Q4",
            description: "Stworzenie prezentacji z wynikami ostatniego kwartału dla zarządu",
            priority: "HIGH",
            status: "TODO",
            createdDate: "2025-06-25",
            dueDate: "2025-06-30",
            assignedTo: "Jan Kowalski"
        },
        {
            id: 2,
            title: "Code review modułu płatności",
            description: "Przegląd kodu nowego modułu obsługi płatności online",
            priority: "MEDIUM",
            status: "IN_PROGRESS",
            createdDate: "2025-06-20",
            dueDate: "2025-06-28",
            assignedTo: "Anna Nowak"
        },
        {
            id: 3,
            title: "Aktualizacja dokumentacji API",
            description: "Zaktualizowanie dokumentacji REST API po ostatnich zmianach",
            priority: "LOW",
            status: "COMPLETED",
            createdDate: "2025-06-15",
            dueDate: "2025-06-25",
            assignedTo: "Piotr Wiśniewski"
        },
        {
            id: 4,
            title: "Naprawa błędu w systemie logowania",
            description: "Krytyczny błąd uniemożliwiający logowanie niektórym użytkownikom",
            priority: "HIGH",
            status: "OVERDUE",
            createdDate: "2025-06-10",
            dueDate: "2025-06-20",
            assignedTo: "Maria Kowalczyk"
        }
    ];
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
                    <div class="task-priority priority-${priority.toLowerCase()}">${getPriorityText(priority)}</div>
                </div>
                <div class="task-description">${escapeHtml(description)}</div>
                <div class="task-meta">
                    <div class="task-dates">
                        <span>📅 Added: ${formatDate(createdDate)}</span>
                        <span>⏰ Deadline: ${formatDate(dueDate)}</span>
                    </div>
                    <div class="task-status status-${status.toLowerCase().replace('_', '-')}">${getStatusText(status)}</div>
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
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    renderTasks();
    updateStatistics();
}

// Aktualizacja statystyk
function updateStatistics() {
    const stats = filteredTasks.reduce((acc, task) => {
        switch(task.status) {
            case 'TODO': acc.todo++; break;
            case 'IN_PROGRESS': acc.progress++; break;
            case 'COMPLETED': acc.done++; break;
            case 'OVERDUE': acc.overdue++; break;
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
    return priorities[priority] || priority;
}

function getStatusText(status) {
    const statuses = {
        'TODO': 'Do wykonania',
        'IN_PROGRESS': 'W trakcie',
        'COMPLETED': 'Zakończone',
        'OVERDUE': 'Przeterminowane'
    };
    return statuses[status] || status;
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

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K = Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchTasks').focus();
    }

    // Ctrl/Cmd + N = New task
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        addNewTask();
    }
});