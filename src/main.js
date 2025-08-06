import { state, dependants } from "./appState";
import { reactive, dependancyChange } from "./proxy/index.js";


function renderTasks() {
    const taskDiv = document.getElementById('tasks');
    taskDiv.innerHTML = '';
    state.forEach((task) => {
        const newDiv = document.createElement("div");
        const taskName = document.createTextNode(task.name);
        if (task.complete) {
            newDiv.style.textDecoration = 'line-through';
        }

        newDiv.appendChild(taskName);
        const currentDiv = document.getElementById('tasks');
        currentDiv.appendChild(newDiv);
    });
}

function completeTask() {
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

