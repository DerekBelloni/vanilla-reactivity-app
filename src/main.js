import { dependants, state, taskCount } from "./appState";
import { reactive, dependancyChange } from "./proxy/index.js";


function renderTasks() {
    const taskDiv = document.getElementById('tasks');
    taskDiv.addEventListener('click', completeTask);
    taskDiv.innerHTML = '';
    state.forEach((task, index) => {
        const checkboxElmt = createCheckBoxElmt();
        const deleteElmt = createDeleteElmt();
        const newDiv = createTaskDiv(task, checkboxElmt, deleteElmt, index);

        if (task.complete) {
            checkboxElmt.checked = true;
            newDiv.style.textDecoration = 'line-through';
        }

        const currentDiv = document.getElementById('tasks');
        currentDiv.appendChild(newDiv);
    });
}

function createCheckBoxElmt() {
    const checkboxElmt = document.createElement("input");
    checkboxElmt.type = "checkbox";
    return checkboxElmt;
}

function createDeleteElmt() {
    const anchorElmt = document.createElement("a");
    anchorElmt.textContent = 'x';
    anchorElmt.href = "#";
    anchorElmt.addEventListener('click', deleteTask);
    return anchorElmt;
}

function createTaskDiv(task, checkboxElmt, deleteElmt, index) {
    const newDiv = document.createElement("div");
    const taskName = document.createTextNode(task.name);
    newDiv.dataset.id = index + 1;
    newDiv.className = "task-div";
    newDiv.appendChild(checkboxElmt);
    newDiv.appendChild(taskName);
    newDiv.appendChild(deleteElmt);
    return newDiv;
}

function completeTask(event) {
    if (event.target.type === 'checkbox') {
        const taskID = event.target.parentElement.dataset.id;
        if (taskID !== null) {
            const completedTask = state[taskID - 1];
            completedTask.complete = true;

        }
    }
    filterTasks(event);
}

function createTask() {
    const inputValue = document.getElementById('newTask').value;
    let newTask = {};
    if (inputValue) {
        newTask = reactive({
            id: state.length,
            name: inputValue,
            complete: false
        });
        state.push(newTask);
    };
    taskCount.value = state.length;
    document.getElementById('newTask').value = '';
}

function filterTasks(event) {
    const filterElmt = document.getElementById('filter').value;
    if (state.length <= 0) {
        console.log('gere');
        document.getElementById('filter').value = 'Filter Tasks';
    }

}

function deleteTask(event) {
    const taskID = event.target.parentElement.dataset.id;
    const idx = taskID - 1;
    state.splice(idx, 1);
}

function manageTaskCount() {
    document.getElementById('task-count').textContent = taskCount.value;
}

dependancyChange(manageTaskCount);
dependancyChange(renderTasks);
document.getElementById('filter').addEventListener('change', filterTasks);
document.getElementById('addTask').addEventListener('click', createTask);

