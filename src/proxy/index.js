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

        }
    });
}

function track(target, prop) {
    if (activeEffect) {
        const effects = getPropSubscribers(target, prop)
        effects.add(activeEffect)
        console.log('banana', effects);
    }
}

function trigger() { }

function dependancyChange(fn) {
    console.log("in dep change: ", fn)
    let effect = () => {
        activeEffect = fn;
        fn();
        activeEffect = null;
    }
    console.log('effect:', effect)
    effect()
    console.log('active effect:', activeEffect);
}

function getPropSubscribers(target, prop) {
    let depsMap = dependants.get(target)
    console.log('deps map: ', depsMap)
    if (!depsMap) {
        depsMap = new Map();
        console.log('deps map:', depsMap)
        dependants.set(target, depsMap);
    }
    let dep = depsMap.get(prop);
    if (!dep) {
        dep = new Set();
        depsMap.set(prop, dep);
    }
    console.log('dep: ', dep)
    return dep;
}

export { reactive, dependancyChange };
