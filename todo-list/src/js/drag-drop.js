export function enableDragAndDrop(list, onDrop) {
    let draggedElement = null;

    list.addEventListener('dragstart', (event) => {
        const taskElement = event.target.closest('.task');

        if (!taskElement || !taskElement.draggable) {
            return;
        }

        draggedElement = taskElement;

        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', taskElement.dataset.id);

        taskElement.classList.add('task--dragging');
    });

    list.addEventListener('dragover', (event) => {
        if (!draggedElement) {
            return;
        }

        event.preventDefault();

        const targetElement = event.target.closest('.task');

        if (!targetElement || targetElement === draggedElement) {
            return;
        }

        const rect = targetElement.getBoundingClientRect();
        const middle = rect.top + rect.height / 2;

        if (event.clientY < middle) {
            list.insertBefore(draggedElement, targetElement);
        } else {
            list.insertBefore(draggedElement, targetElement.nextElementSibling);
        }
    });

    list.addEventListener('drop', (event) => {
        event.preventDefault();

        if (draggedElement) {
            onDrop();
        }
    });

    list.addEventListener('dragend', () => {
        if (draggedElement) {
            draggedElement.classList.remove('task--dragging');
        }

        draggedElement = null;
    });
}
