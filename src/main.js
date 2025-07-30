import state from "./appState";

export function dumpState() {
    console.log('test');
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


document.getElementById('btn').addEventListener('click', dumpState);
