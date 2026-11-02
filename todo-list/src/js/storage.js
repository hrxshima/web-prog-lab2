
const STORAGE_KEY = 'todo-tasks';

// Получение задач из localStorage
export function loadTasks() {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
        return [];
    }

    try {
        return JSON.parse(savedTasks);
    } catch (error) {
        console.error('Не удалось загрузить задачи:', error);
        return [];
    }
}

// Сохранение задач в localStorage
export function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
