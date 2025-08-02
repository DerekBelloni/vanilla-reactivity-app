import { state, dependants, effects, activeEffect } from '../appState';


function reactive(obj) {
    return new Proxy(obj, {
        get(target, prop, receiver) {
            const result = Reflect.get(target, prop, receiver);
            track();

            return result;
        },
        set(target, prop, receiver, value) {

        }
    });
}

function track() { }

function trigger() { }

function dependancyChange() { }

export default reactive;
