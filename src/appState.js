import { ref, reactive } from "./proxy";

const state = reactive([]);
let dependants = new WeakMap();
let effects = new Set();
let taskCount = ref(0);

export { state, dependants, taskCount, effects };
