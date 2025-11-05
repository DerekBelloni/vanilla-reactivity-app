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

        // check if the global active subscriber is a computed
        // if so call recursively handing in the subscriber as the target
        // and 'computed' as the prop to see if anything upstream is a computed
        // if so track it, I might need to call dependamcyChange on the effects handed back
        // for a computed if those effects themselvers are computeds. maybe this happens in the computed get? 

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
}

function dependencyChange(fn, fnName, computed = false) {
    console.log('in dependency change');
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
