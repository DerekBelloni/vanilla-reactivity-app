import { track } from '../proxy/index.js';

export class refImpl {
    constructor(val) {
        this.val = val;
    }

    get value() {
        track(this, 'value');
        return this.val;
    }

    set value(newVal) {
        this.val = newVal;
        trigger(this, 'value');
    }
}

