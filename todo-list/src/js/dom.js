export function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}

export function createTaskForm() {
    const form = createElement('form', 'task-form');

    const formTitle = createElement(
        'h2',
        'task-form__title',
        'Новая задача'
    );

    const titleInput = createElement('input', 'task-form__input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Название задачи...';
    titleInput.name = 'title';
    titleInput.required = true;

    const dateInput = createElement('input', 'task-form__date');
    dateInput.type = 'date';
    dateInput.name = 'date';
    dateInput.min = '2020-01-01';
    dateInput.max = '2100-12-31';
    dateInput.required = true;

    const submitButton = createElement(
        'button',
        'task-form__button',
        'Добавить задачу'
    );
    submitButton.type = 'submit';

    form.append(
        formTitle,
        titleInput,
        dateInput,
        submitButton
    );

    return form;
}

export function createTaskElement(task) {
    const article = createElement('article', 'task');

    const checkbox = createElement('input', 'task__checkbox');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;

    const title = createElement('h3', 'task__title', task.title);

    const date = createElement('time', 'task__date', task.date);
    date.dateTime = task.date;

    article.append(checkbox, title, date);

    return article;
}

export function createTaskList() {
    const section = createElement('section', 'tasks-section');

    const title = createElement(
        'h2',
        'tasks-section__title',
        'Мои задачи'
    );

    const list = createElement('div', 'tasks-list');

    section.append(title, list);

    return {
        section,
        list
    };
}