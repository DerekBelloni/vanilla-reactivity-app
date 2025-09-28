import { dependants, state, taskCount } from "./appState";
import { Computed } from "./proxy/computed.js";
import { reactive, dependancyChange, ref } from "./proxy/index.js";

let filteredTasks = reactive([]);
let filterActive = ref(false);
let activeState = reactive([]);
let testData = reactive({ a: 1, b: 2 });

let inactiveSum = new Computed(() => {
    return testData.a + testData.b;
});

let activeSum = new Computed(() => {
    let sum = 0;
    state.forEach((task) => {
        if (task.complete) {
            sum++;
        } else if (!task.complete && sum > 0) sum--;
    });
    return sum;
})

function renderTasks() {
    const taskDiv = document.getElementById('tasks');
    taskDiv.addEventListener('click', completeTask);
    taskDiv.innerHTML = '';

    if (filterActive.value) {
        activeState = filteredTasks;
    } else activeState = state;

    activeState.forEach((task, index) => {
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

    const activeSumDiv = document.getElementById('activeSum');
    activeSumDiv.textContent = `Completed Tasks: ${activeSum.value}`;
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

    newDiv.dataset.id = task.id;
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
            console.log('inside complete task');
            const completedTask = state[taskID - 1];
            completedTask.complete = !completedTask.complete;
        }
    }
    activeSum.value;
}

function createTask() {
    const inputValue = document.getElementById('newTask').value;
    let newTask = {};
    if (inputValue) {
        newTask = reactive({
            id: state.length + 1,
            name: inputValue,
            complete: false
        });
        state.push(newTask);
    };

    taskCount.value = state.length;
    document.getElementById('newTask').value = '';
}

function filterTasks() {
    const filterVal = document.getElementById('filter').value;
    if (state.length <= 0) {
        document.getElementById('filter').value = 'test';
    }
    if (filterVal != 'test') {
        filterActive.value = true;
    } else {
        filterActive.value = false;
        return;
    }

    const complete = filterVal == 'complete' ? true : false;
    const temp = state.filter((task) => task.complete == complete);

    filterActive.value = true;
    filteredTasks.length = 0;
    filteredTasks.push(...temp);
}

function resetTaskIDs() {

}

function deleteTask(event) {
    const taskID = parseInt(event.target.parentElement.dataset.id);
    let idxToDelete = state.findIndex((item) => {
        return item.id === taskID;
    });

    state.splice(idxToDelete, 1);
    taskCount.value = state.length;

    if (filterActive.value) {
        filterTasks();
    }
}

function manageTaskCount() {
    document.getElementById('task-count').textContent = `Task Count: ${taskCount.value}`;
}

dependancyChange(manageTaskCount, 'manageTaskCount');
dependancyChange(renderTasks, 'renderTasks');

document.getElementById('filter').addEventListener('change', filterTasks);
document.getElementById('addTask').addEventListener('click', createTask);

