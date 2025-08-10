import { ref, reactive } from "./proxy";

let state = reactive([]);
let dependants = new WeakMap();
let effects = new Set();
let taskCount = ref(0);
let filteredTasks = reactive([]);
let filterActive = ref(false);

export { state, dependants, filterActive, taskCount, effects, filteredTasks };
