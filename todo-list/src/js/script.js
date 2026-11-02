
import {
    createElement,
    createTaskForm,
    createTaskElement,
    createTaskList,
    createSearchInput
} from './dom.js';

import { createTask } from './tasks.js';

// Подключение CSS
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './src/css/style.css';

document.head.append(link);

// Основной контейнер
const app = createElement('main', 'app');

// Заголовок
const header = createElement('header', 'header');

const title = createElement('h1', 'header__title', 'Мои задачи');

const subtitle = createElement(
    'p',
    'header__subtitle',
    'Планируй, выполняй, достигай.'
);

header.append(title, subtitle);

// Форма и список задач
const taskForm = createTaskForm();
const { section, list } = createTaskList();
const searchInput = createSearchInput();

app.append(header, taskForm, searchInput, section);
document.body.append(app);

// Массив для хранения задач
const tasks = [];


// Создание карточки задачи со всеми обработчиками
function createTaskCard(task) {
    const taskElement = createTaskElement(task);

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
    });

    // Удаление задачи
    const deleteButton = taskElement.querySelector('.task__delete');

    deleteButton.addEventListener('click', () => {
        const taskIndex = tasks.findIndex(item => item.id === task.id);

        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
        }

        renderTasks();
    });

    // Редактирование задачи
    const editButton = taskElement.querySelector('.task__edit');

    editButton.addEventListener('click', () => {
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = task.title;
        titleInput.className = 'task__edit-input';

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = task.date;
        dateInput.className = 'task__edit-date';

        const saveButton = createElement(
            'button',
            'task__save',
            'Сохранить'
        );
        saveButton.type = 'button';

        const cancelButton = createElement(
            'button',
            'task__cancel',
            'Отмена'
        );
        cancelButton.type = 'button';

        const titleElement = taskElement.querySelector('.task__title');
        const dateElement = taskElement.querySelector('.task__date');

        titleElement.replaceWith(titleInput);
        dateElement.replaceWith(dateInput);

        editButton.hidden = true;
        deleteButton.hidden = true;

        taskElement.append(saveButton, cancelButton);

        // Сохранение изменений
        saveButton.addEventListener('click', () => {
            const newTitle = titleInput.value.trim();
            const newDate = dateInput.value;

            if (!newTitle || !newDate) {
                alert('Заполните название и дату задачи');
                return;
            }

            task.title = newTitle;
            task.date = newDate;

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

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery)
    );

    filteredTasks.forEach(task => {
        const taskElement = createTaskCard(task);
        list.append(taskElement);
    });
}


// Поиск задач при вводе текста
searchInput.addEventListener('input', () => {
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

    renderTasks();

    taskForm.reset();
});
