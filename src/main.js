import { state, dependants } from "./appState";
import { reactive, dependancyChange } from "./proxy/index.js";


// I believe this would be an effect that needs subscribed to the task handed into it
function buildTaskElement(task) {
    const newDiv = document.createElement("div");
    const taskName = document.createTextNode(task.name);
    newDiv.appendChild(taskName);
    const currentDiv = document.getElementById('tasks');
    currentDiv.appendChild(newDiv);
}

function createTask(task = null) {
    // Every time a task is created, it needs to be handed to the reactive function   console.log("getting called in create taks")
    if (!task) {
        state.push(newTask);
    } else state.push(task);
    console.log('new task read:', newTask.name);
}

function completeTask() {
    for (let i = 0; i < state.length; i++) {
        console.log('state at i;', state[i].name);
    }
    console.log('dependants: ', dependants);
}

function deleteTask() {

}

let newTask = reactive({ id: 1, name: 'test', complete: false });
dependancyChange(createTask);
createTask(reactive({ id: 2, name: 'test two', complete: false }));
completeTask();

