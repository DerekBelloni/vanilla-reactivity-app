import { state, dependants } from "./appState";
//import testExport from "./proxy";

export function dumpState() {
    console.log('test');
    //testExport();
    for (let i = 0; i < state.length; i++) {
        const test = new Proxy(state[i], testHandler)
        console.log('[test]:', test);

        return buildTaskElement(state[i]);
    }
}

const testHandler = {
    get(target, prop, receiver) {
        console.log('[receiver]:', receiver);
    }
}


// I believe this would be an effect that needs subscribed to the task handed into it
function buildTaskElement(task) {
    const newDiv = document.createElement("div");
    const taskName = document.createTextNode(task.name);
    newDiv.appendChild(taskName);
    const currentDiv = document.getElementById('tasks');
    currentDiv.appendChild(newDiv);
}

function createTask() {
    // Every time a task is created, it needs to be handed to the reactive function
}

function completeTask() {

}

function deleteTask() {

}


document.getElementById('btn').addEventListener('click', dumpState);
