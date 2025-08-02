import { state, dependants } from "./appState";
import testExport from "./proxy";

export function dumpState() {
    console.log('test');
    testExport();
    for (let i = 0; i < state.length; i++) {
        console.log(state[i]);
        return buildTaskElement(state[i]);
    }
}

function buildTaskElement(task) {
    const newDiv = document.createElement("div");
    const taskName = document.createTextNode(task.name);
    newDiv.appendChild(taskName);
    const currentDiv = document.getElementById('tasks');
    currentDiv.appendChild(newDiv);
}

function createTask() {

}

function completeTask() {

}

function deleteTask() {

}


document.getElementById('btn').addEventListener('click', dumpState);
