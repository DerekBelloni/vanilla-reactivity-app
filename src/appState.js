const state = [
    { name: 'taskOne', id: 1, completed: false },
    { name: 'taskTwo', id: 2, completed: false },
    { name: 'taskThree', id: 3, completed: false }
];

let dependants = new Map();
let activeEffect = null;
let effects = new Set();

export { state, dependants, effects, activeEffect };
