import { globals, dependants } from '../appState';
import { getPropSubscribers } from './index.js';

export class ReactiveImpl {
    constructor(obj,) {
        this.obj = new Proxy(obj, { getVal, setVal });
    }

    getVal(target, prop, receiver) {
        const result = Reflect.get(target, prop, receiver);
        track(target, prop);

        if (typeof result === Object && result !== null) {
            return reactive(result);
        }

        return result;
    }

    setVal(target, prop, receiver) {
        const result = Reflect.set(target, prop, value, receiver);
        trigger(target, prop);
        return result;
    }
}

