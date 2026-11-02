export function createTask(title, date) {
    return {
        id: crypto.randomUUID(),
        title: title,
        date: date,
        completed: false
    };
}