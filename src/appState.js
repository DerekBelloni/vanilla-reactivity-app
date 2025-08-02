const state = [];
let dependants = new WeakMap();
let effects = new Set();

export { state, dependants, effects };
