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

function createTask(task, domInteraction) {
    if (domInteraction) {
        const domInputValue = document.getElementById('newTask').value;
        console.log('dom input value:', domInputValue);
        return;
    }


    if (state.includes(task.id)) {
        return;
    }

    state.push(task);
    console.log('dependants: ', dependants);
}

function completeTask() {
}

function readInput() {
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
}

function deleteTask() {
}

let newTask = reactive({ id: 1, name: 'test', complete: false });
dependancyChange(renderTasks);
createTask(newTask);
createTask(reactive({ id: 2, name: 'test two', complete: false }))
//renderTasks();

document.getElementById('addTask').addEventListener('click', readInput);

