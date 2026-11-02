import { createElement } from './dom.js';

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

app.append(header);

document.body.append(app);