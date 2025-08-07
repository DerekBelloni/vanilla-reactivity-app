import { state, dependants } from "./appState";
import { reactive, dependancyChange } from "./proxy/index.js";


function renderTasks() {
    const taskDiv = document.getElementById('tasks');
    taskDiv.addEventListener('click', completeTask);
    taskDiv.innerHTML = '';
    state.forEach((task, index) => {
        const newDiv = document.createElement("div");
        newDiv.dataset.id = index + 1;
        const checkboxElmt = document.createElement("input");
        checkboxElmt.type = "checkbox";
        const taskName = document.createTextNode(task.name);
        if (task.complete) {
            newDiv.style.textDecoration = 'line-through';
        }
        newDiv.className = "task-div";
        newDiv.appendChild(checkboxElmt);
        newDiv.appendChild(taskName);
        const currentDiv = document.getElementById('tasks');
        currentDiv.appendChild(newDiv);
    });
}

function completeTask(event) {
    const taskID = event.target.parentElement.dataset.id;
    console.log('taskID:', taskID, 'state:', state);
    if (taskID !== null) {
        const completedTask = state[taskID - 1];
        completedTask.complete = true;
    }
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
    document.getElementById('newTask').value = '';
}

function filterTasks() {

}

function deleteTask() {
}

dependancyChange(renderTasks);
document.getElementById('addTask').addEventListener('click', createTask);

