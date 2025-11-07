import { globals, dependants } from '../appState';
import { Computed } from '../proxy/computed';


function reactive(obj) {
    return new Proxy(obj, {
        get(target, prop, receiver) {
            const result = Reflect.get(target, prop, receiver);
            track(target, prop);

            if (typeof result === Object && result !== null) {
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
            track(refObject, 'value', 'refObj');
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
    console.log('inside track');
    if (globals.activeSubscriber) {
        const effects = getPropSubscribers(target, prop)
        effects.add(globals.activeSubscriber)
    }
}

function trigger(target, prop) {
    const effects = getPropSubscribers(target, prop);

    effects.forEach((effect) => {
        if (effect instanceof Computed) {
            if (effect.dirty) return;
            effect.dirty = true;
            trigger(effect, 'computed')
        } else {
            effect()
        }
    });
    console.log('dependents at end of trigger:', dependants)
}

function dependencyChange(fn, fnName, computed = false) {
    let effect = () => {
        globals.activeSubscriber = effect;
        fn();
        globals.activeSubscriber = null;
    }
    effect.__name = fnName;
    if (computed) effect.__isComputed = true;
    effect()
}

function getPropSubscribers(target, prop, type = null) {
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

export { reactive, ref, dependencyChange, getPropSubscribers, track, trigger };
