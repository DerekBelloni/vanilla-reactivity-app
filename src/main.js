import { dependants, state, taskCount } from "./appState";
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
            checkboxElmt.checked = true;
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
    taskCount.value = state.length;
    console.log('dependants in create task: ', dependants);
    document.getElementById('newTask').value = '';
}

function filterTasks() {

}

function deleteTask() {
}

function manageTaskCount() {
    // this needs to run when a task is added to state
    // meaning it is a subscriber to the state.length
    // once it is triggered I need to get an html element that displays the value of the count
    // update the count and rerender it
    document.getElementById('task-count').textContent = taskCount.value;
}

dependancyChange(manageTaskCount);
dependancyChange(renderTasks);
document.getElementById('addTask').addEventListener('click', createTask);

