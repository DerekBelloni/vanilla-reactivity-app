import { state, dependants, effects, activeEffect } from '../appState';


function reactive(obj) {
    return new Proxy(obj, {
        get(target, prop, receiver) {
            const result = Reflect.get(target, prop, receiver);
            track();


            // if the result is an object we need to recursively hand it into the 'reactive()' to provide tracking for nested structures
            if (typeof result === Object) {
                return result;
            }
        },
        set(target, prop, value, receiver) {

        }
    });
}

function track(target, prop) {
    if (activeEffect) {
        const effects = getPropSubscribers(target, prop)
        effects.add(activeEffect)
    }
}

function trigger() { }

function dependancyChange(fn) {
    const effect = () => {
        activeEffect = effect;
        fn();
        activeEffect = null;
    }
    effect()
}

function getPropSubscribers(target, prop) {
    dependants.get(prop);
}

export default reactive;
