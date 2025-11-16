import { CleanupRegistry } from "./main";
import { ref, reactive } from "./proxy";

let state = reactive([]);
let dependants = new WeakMap();
let taskCount = ref(0);
let _activeSubscriber = null;
let _cleanupRegistry = new CleanupRegistry();

const globals = {
    activeSubscriber: _activeSubscriber,
    cleanupRegistry: _cleanupRegistry
}

export { globals, state, dependants, taskCount };
