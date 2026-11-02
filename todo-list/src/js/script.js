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

    const deleteButton = taskElement.querySelector('.task__delete');

    deleteButton.addEventListener('click', () => {
        const taskIndex = tasks.findIndex(item => item.id === task.id);
    
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
        }
    
        taskElement.remove();
    });    

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
    
        saveButton.addEventListener('click', () => {
            const newTitle = titleInput.value.trim();
            const newDate = dateInput.value;
    
            if (!newTitle || !newDate) {
                alert('Заполните название и дату задачи');
                return;
            }
    
            task.title = newTitle;
            task.date = newDate;
    
            titleElement.textContent = newTitle;
            dateElement.textContent = newDate;
            dateElement.dateTime = newDate;
    
            titleInput.replaceWith(titleElement);
            dateInput.replaceWith(dateElement);
    
            saveButton.remove();
            cancelButton.remove();
    
            editButton.hidden = false;
            deleteButton.hidden = false;
        });
    
        cancelButton.addEventListener('click', () => {
            titleInput.replaceWith(titleElement);
            dateInput.replaceWith(dateElement);
    
            saveButton.remove();
            cancelButton.remove();
    
            editButton.hidden = false;
            deleteButton.hidden = false;
        });
    });
    
    list.append(taskElement);
    
    taskForm.reset();
});