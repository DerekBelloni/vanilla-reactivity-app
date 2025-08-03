import { reactive } from "./proxy";

const state = reactive([]);
let dependants = new WeakMap();
let effects = new Set();

export { state, dependants, effects };
