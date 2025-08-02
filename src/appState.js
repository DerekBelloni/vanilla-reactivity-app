const state = [
    { name: 'taskOne', id: 1, completed: false },
    { name: 'taskTwo', id: 2, completed: false },
    { name: 'taskThree', id: 3, completed: false }
];

const dependants = new Map();
const activeEffect = null;
const effects = new Set();

export { state, dependants, effects };
