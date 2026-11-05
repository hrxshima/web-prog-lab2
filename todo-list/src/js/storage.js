const STORAGE_KEY = 'todo-tasks';

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

export function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
