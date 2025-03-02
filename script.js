const taskInput = document.querySelector('.task-input');
const addTaskButton = document.querySelector('.add-task-btn');
const taskList = document.querySelector('.task-list');

document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
});

addTaskButton.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
        taskId: Date.now(),
        text: text,
        completed: false
    };

    createTaskItem(newTask);
    saveTaskToStorage(newTask);

    taskInput.value = '';
}

function createTaskItem(task) {
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.dataset.id = task.taskId;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', toggleTask);

    const span = document.createElement('span');
    span.classList.add('task-text');
    span.textContent = task.text;
    if (task.completed) {
        span.classList.add('done');
    }

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('task-buttons');

    const editBtn = document.createElement('button');
    editBtn.classList.add('btn-edit');
    editBtn.innerHTML = '✏️';
    editBtn.addEventListener('click', editTask);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn-delete');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.addEventListener('click', deleteTask);

    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(buttonsDiv);

    taskList.appendChild(li);
}

function toggleTask(e) {
    const li = e.target.closest('.task-item');
    const textElement = li.querySelector('.task-text');

    textElement.classList.toggle('done', e.target.checked);

    const id = li.dataset.id;
    updateTaskInStorage(id, { completed: e.target.checked });
}

function editTask(e) {
    const li = e.target.closest('.task-item');
    const span = li.querySelector('.task-text');

    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent;
    input.classList.add('task-input', 'edit-mode');

    li.replaceChild(input, span);

    input.focus();
    input.select();

    input.addEventListener('keypress', (evt) => {
        if (evt.key === 'Enter') finishEdit();
    });
    input.addEventListener('blur', finishEdit);

    function finishEdit() {
        const newText = input.value.trim() || 'Без названия';
        span.textContent = newText;
        li.replaceChild(span, input);

        updateTaskInStorage(li.dataset.id, { text: newText });
    }
}

function deleteTask(e) {
    const li = e.target.closest('.task-item');
    const id = li.dataset.id;

    li.remove();
    removeTaskFromStorage(id);
}

function loadTasksFromStorage() {
    const tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    tasks.forEach((t) => createTaskItem(t));
}

function saveTaskToStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    tasks.push(task);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function updateTaskInStorage(id, updatedFields) {
    let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    tasks = tasks.map((t) => {
        if (t.taskId == id) {
            return { ...t, ...updatedFields };
        }
        return t;
    });
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function removeTaskFromStorage(id) {
    let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    tasks = tasks.filter((t) => t.taskId != id);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}
