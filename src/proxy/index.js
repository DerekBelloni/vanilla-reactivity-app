import { state, dependants } from '../appState';
let activeEffect = null;

function reactive(obj) {
    return new Proxy(obj, {
        get(target, prop, receiver) {
            const result = Reflect.get(target, prop, receiver);
            track(target, prop);


            // if the result is an object we need to recursively hand it into the 'reactive()' to provide tracking for nested structures
            if (typeof result === Object && result !== null) {
                reactive(result);
            }

            return result;
        },
        set(target, prop, value, receiver) {
            const result = Reflect.set(target, prop, value, receiver);
            trigger(target, prop);
            return result;
        }
    });
}

function track(target, prop) {
    if (activeEffect) {
        const effects = getPropSubscribers(target, prop)
        effects.add(activeEffect)
    }
}

function trigger(target, prop) {
    const effects = getPropSubscribers(target, prop);
    effects.forEach((effect) => effect());
}

function dependancyChange(fn) {
    let effect = () => {
        activeEffect = fn;
        fn();
        activeEffect = null;
    }
    effect()
}

function getPropSubscribers(target, prop) {
    let depsMap = dependants.get(target)
    if (!depsMap) {
        depsMap = new Map();
        dependants.set(target, depsMap);
    }
    let dep = depsMap.get(prop);
    if (!dep) {
        dep = new Set();
        depsMap.set(prop, dep);
    }
    return dep;
}

export { reactive, dependancyChange };
