import { state, dependants } from "./appState";
import { reactive, dependancyChange } from "./proxy/index.js";


// I believe this would be an effect that needs subscribed to the task handed into it
function renderTasks() {
    const taskDiv = document.getElementById('tasks');
    taskDiv.innerHTML = '';
    state.forEach((task) => {
        const newDiv = document.createElement("div");
        const taskName = document.createTextNode(task.name);
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
        newTask = {
            id: state.length,
            name: inputValue,
            complete: false
        }
        state.push(newTask);
    }
    document.getElementById('newTask').value = '';
}

function deleteTask() {
}

let newTask = reactive({ id: 1, name: 'test', complete: false });
dependancyChange(renderTasks);

document.getElementById('addTask').addEventListener('click', createTask);

