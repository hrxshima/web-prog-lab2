import {
    createElement,
    createDateField,
    createTaskForm,
    createTaskElement,
    createTaskList,
    createSearchInput,
    createTaskFilters,
    createTaskSort
} from './dom.js';

import { createTask } from './tasks.js';
import { loadTasks, saveTasks } from './storage.js';
import { enableDragAndDrop } from './drag-drop.js';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './src/css/style.css';

document.head.append(link);

const app = createElement('main', 'app');

const header = createElement('header', 'header');

const title = createElement('h1', 'header__title', 'мой планнер');

const subtitle = createElement(
    'p',
    'header__subtitle',
    ''
);

header.append(title, subtitle);

// Форма и список задач
const taskForm = createTaskForm();
const { section, list } = createTaskList();
const searchInput = createSearchInput();
const searchField = createElement('div', 'search-field');
const clearSearchButton = createElement('button', 'search-clear');
clearSearchButton.type = 'button';
clearSearchButton.hidden = true;
clearSearchButton.setAttribute('aria-label', 'Очистить поиск');
clearSearchButton.title = 'Очистить поиск';
searchField.append(searchInput, clearSearchButton);

const taskFilters = createTaskFilters();

const taskSort = createTaskSort();

app.append(
    header,
    taskForm,
    searchField,
    taskFilters,
    taskSort,
    section
);
document.body.append(app);

// Массив для хранения задач
const tasks = loadTasks();

let currentFilter = 'all';


// Создание карточки задачи со всеми обработчиками
function createTaskCard(task) {
    const taskElement = createTaskElement(task);

    // Возможность перетаскивания задачи
    const canDrag =
        currentFilter === 'all' &&
        !searchInput.value.trim() &&
        taskSort.value === 'manual';

    taskElement.draggable = canDrag;

    // Отображение выполненной задачи
    if (task.completed) {
        taskElement.classList.add('task--completed');
    }

    // Чекбокс выполнения
    const checkbox = taskElement.querySelector('.task__checkbox');

    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;

        taskElement.classList.toggle(
            'task--completed',
            task.completed
        );

        saveTasks(tasks);
        renderTasks();
    });

    // Удаление задачи
    const deleteButton = taskElement.querySelector('.task__delete');

    deleteButton.addEventListener('click', () => {
        const taskIndex = tasks.findIndex(item => item.id === task.id);

        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
        }
        
        saveTasks(tasks);
        renderTasks();
    });

    // Редактирование задачи
    const editButton = taskElement.querySelector('.task__edit');

    editButton.addEventListener('click', () => {
        taskElement.classList.add('task--editing');
        taskElement.draggable = false;
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = task.title;
        titleInput.className = 'task__edit-input';
        titleInput.setAttribute('aria-label', 'Название задачи');

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = task.date;
        dateInput.className = 'task__edit-date';
        dateInput.setAttribute('aria-label', 'Дата задачи');

        const saveButton = createElement(
            'button',
            'task__save',
            'Сохранить'
        );
        saveButton.type = 'button';
        saveButton.setAttribute('aria-label', 'Сохранить');
        saveButton.title = 'Сохранить';

        const cancelButton = createElement(
            'button',
            'task__cancel'
        );
        cancelButton.type = 'button';
        cancelButton.setAttribute('aria-label', 'Отменить редактирование');
        cancelButton.title = 'Отменить редактирование';

        const titleElement = taskElement.querySelector('.task__title');
        const dateElement = taskElement.querySelector('.task__date');

        titleElement.replaceWith(titleInput);
        dateElement.replaceWith(createDateField(dateInput, 'date-field--edit'));

        editButton.hidden = true;
        deleteButton.hidden = true;

        taskElement.append(saveButton, cancelButton);

        // Сохранение изменений
        saveButton.addEventListener('click', () => {
            const newTitle = titleInput.value.trim();
            const newDate = dateInput.value;

            if (!newTitle || !newDate) {
                alert('заполните название и дату задачи');
                return;
            }

            task.title = newTitle;
            task.date = newDate;
            
            saveTasks(tasks);
            renderTasks();
        });

        // Отмена редактирования
        cancelButton.addEventListener('click', () => {
            renderTasks();
        });
    });

    return taskElement;
}


// Отображение списка задач с учётом поиска
function renderTasks() {
    list.replaceChildren();

    const searchQuery = searchInput.value.toLowerCase().trim();

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchQuery);

        const matchesFilter =
            currentFilter === 'all' ||
            (currentFilter === 'active' && !task.completed) ||
            (currentFilter === 'completed' && task.completed);

        return matchesSearch && matchesFilter;
    });

    const sortedTasks = [...filteredTasks];

    if (taskSort.value === 'asc') {
        sortedTasks.sort((a, b) => a.date.localeCompare(b.date));
    } else if (taskSort.value === 'desc') {
        sortedTasks.sort((a, b) => b.date.localeCompare(a.date));
    }

    sortedTasks.forEach(task => {
        const taskElement = createTaskCard(task);
        list.append(taskElement);
    });
}

// Подключение Drag-and-drop
enableDragAndDrop(list, () => {
    const orderedIds = Array.from(list.children).map(
        element => element.dataset.id
    );

    const taskMap = new Map(
        tasks.map(task => [task.id, task])
    );

    const orderedTasks = orderedIds.map(
        id => taskMap.get(id)
    );

    tasks.splice(0, tasks.length, ...orderedTasks);

    saveTasks(tasks);
});

// Поиск задач при вводе текста
searchInput.addEventListener('input', () => {
    clearSearchButton.hidden = !searchInput.value;
    renderTasks();
});

clearSearchButton.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchButton.hidden = true;
    renderTasks();
    searchInput.focus();
});

taskSort.addEventListener('change', () => {
    renderTasks();
});

taskFilters.addEventListener('click', (event) => {
    const button = event.target.closest('.task-filters__button');

    if (!button) {
        return;
    }

    currentFilter = button.dataset.filter;

    const filterButtons = taskFilters.querySelectorAll(
        '.task-filters__button'
    );

    filterButtons.forEach(filterButton => {
        filterButton.classList.remove(
            'task-filters__button--active'
        );
    });

    button.classList.add('task-filters__button--active');

    renderTasks();
});

// Добавление новой задачи
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const titleInput = taskForm.querySelector('[name="title"]');
    const dateInput = taskForm.querySelector('[name="date"]');

    const title = titleInput.value.trim();
    const date = dateInput.value;

    if (!title || !date) {
        return;
    }

    const task = createTask(title, date);

    tasks.push(task);
    
    saveTasks(tasks);
    renderTasks();

    taskForm.reset();
});

renderTasks();
