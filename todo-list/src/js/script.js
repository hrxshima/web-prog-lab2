import {
    createElement,
    createTaskForm,
    createTaskElement,
    createTaskList
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

const taskForm = createTaskForm();

const { section, list } = createTaskList();


app.append(header, taskForm, section);

document.body.append(app);

// Массив для хранения задач
const tasks = [];


// Обработка отправки формы
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

    const taskElement = createTaskElement(task);

    const checkbox = taskElement.querySelector('.task__checkbox');
    
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
    
        if (task.completed) {
            taskElement.classList.add('task--completed');
        } else {
            taskElement.classList.remove('task--completed');
        }
    });
    
    list.append(taskElement);
    
    taskForm.reset();
});