import { getPropSubscribers, track } from "./index.js";
import { globals } from "../appState";


export class Computed {
    constructor(getter, name = null) {
        this.dirty = true;
        this.cached = null;
        this.getter = getter;
        this.name = name;
    }

    _compute() {
        console.log("computed name:", this.name);
        let deps = getPropSubscribers(this, 'computed');
        this._cleanupOldDeps(deps);

        let prev = globals.activeSubscriber
        globals.activeSubscriber = this;
        this.cached = this.getter();
        globals.activeSubscriber = prev;
        this.dirty = false;
    }

    _cleanupOldDeps(deps) {
        for (let dep of deps) {
            console.log('dep in _cleanupOldDeps: ', dep);
            deps.delete(dep);
        }
        console.log('after cleanup, deps size: ', deps.size);
    }

    get value() {
        if (this.dirty) {
            this._compute();
        }

        if (globals.activeSubscriber) {
            track(this, 'computed')
        }

        return this.cached;
    }
}
