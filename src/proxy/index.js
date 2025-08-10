import { dependants } from '../appState';
let activeEffect = null;


function reactive(obj) {
    return new Proxy(obj, {
        get(target, prop, receiver) {
            const result = Reflect.get(target, prop, receiver);
            track(target, prop);


            if ((typeof result === Object && result !== null) || (typeof result === Array && result.length > 0)) {
                return reactive(result);
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

function ref(value) {
    const refObject = {
        get value() {
            track(refObject, 'value');
            return value;
        },
        set value(newVal) {
            value = newVal;
            trigger(refObject, 'value')
        }
    }
    return refObject;
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
        activeEffect = effect;
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

export { reactive, ref, dependancyChange };
