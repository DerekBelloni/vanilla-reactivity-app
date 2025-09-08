import { ref, reactive } from "./proxy";

let state = reactive([]);
let dependants = new WeakMap();
let effects = new Set();
let taskCount = ref(0);
let _activeSubscriber = null;

const globals = {
    activeSubscriber: _activeSubscriber
}

export { globals, state, dependants, taskCount, effects };
