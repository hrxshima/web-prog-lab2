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
        'новая задача'
    );

    const titleInput = createElement('input', 'task-form__input');
    titleInput.type = 'text';
    titleInput.placeholder = 'название задачи...';
    titleInput.name = 'title';
    titleInput.required = true;

    const dateInput = createElement('input', 'task-form__date');
    dateInput.type = 'date';
    dateInput.name = 'date';
    dateInput.min = '2020-01-01';
    dateInput.max = '2100-12-31';
    dateInput.required = true;
    dateInput.setAttribute('aria-label', 'Дата новой задачи');
    const dateField = createDateField(dateInput, 'date-field--new');
    form.addEventListener('reset', () => {
        dateField.querySelector('.date-field__value').textContent = 'выберите дату...';
    });

    const submitButton = createElement(
        'button',
        'task-form__button',
        'добавить задачу'
    );
    submitButton.type = 'submit';

    form.append(
        formTitle,
        titleInput,
        dateField,
        submitButton
    );

    return form;
}

export function createDateField(input, className) {
    const field = createElement('div', `date-field ${className}`);
    const value = createElement('span', 'date-field__value');
    value.setAttribute('aria-hidden', 'true');

    function updateValue() {
        value.textContent = input.value
            ? input.value.split('-').reverse().join('.')
            : 'выберите дату...';
    }

    input.addEventListener('input', updateValue);
    input.addEventListener('change', updateValue);
    updateValue();
    field.append(input, value);
    return field;
}

export function createTaskElement(task) {
    const article = createElement('article', 'task');

    article.draggable = true;
    article.dataset.id = task.id;

    const checkbox = createElement('input', 'task__checkbox');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;

    const title = createElement('h3', 'task__title', task.title);

    const date = createElement('time', 'task__date', task.date);
    date.dateTime = task.date;

    const editButton = createElement(
        'button',
        'task__edit',
        'Редактировать'
    );
    editButton.type = 'button';
    editButton.setAttribute('aria-label', 'Редактировать');

    const deleteButton = createElement(
        'button',
        'task__delete',
        'Удалить'
    );
    deleteButton.type = 'button';
    deleteButton.setAttribute('aria-label', 'Удалить');

    article.append(
        checkbox,
        title,
        date,
        editButton,
        deleteButton
    );

    return article;
}

export function createTaskList() {
    const section = createElement('section', 'tasks-section');

    const title = createElement(
        'h2',
        'tasks-section__title',
        'мои задачи'
    );

    const list = createElement('div', 'tasks-list');

    section.append(title, list);

    return {
        section,
        list
    };
}

export function createSearchInput() {
    const searchInput = createElement('input', 'search-input');

    searchInput.type = 'search';
    searchInput.placeholder = 'поиск задач...';
    searchInput.name = 'search';
    searchInput.setAttribute('aria-label', 'Поиск задач по названию');

    return searchInput;
}

export function createTaskFilters() {
    const filters = createElement('div', 'task-filters');

    const filterOptions = [
        { value: 'all', text: 'все' },
        { value: 'active', text: 'активные' },
        { value: 'completed', text: 'выполненные' }
    ];

    filterOptions.forEach(option => {
        const button = createElement(
            'button',
            'task-filters__button',
            option.text
        );

        button.type = 'button';
        button.dataset.filter = option.value;

        if (option.value === 'all') {
            button.classList.add('task-filters__button--active');
        }

        filters.append(button);
    });

    return filters;
}

export function createTaskSort() {
    const sortSelect = createElement('select', 'task-sort');
    sortSelect.setAttribute('aria-label', 'Порядок задач');

    const options = [
        { value: 'manual', text: 'вручную' },
        { value: 'asc', text: 'сначала ближайшие' },
        { value: 'desc', text: 'сначала поздние' }
    ];

    options.forEach(option => {
        const optionElement = createElement(
            'option',
            '',
            option.text
        );

        optionElement.value = option.value;
        sortSelect.append(optionElement);
    });

    return sortSelect;
}
