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