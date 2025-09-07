import { getPropSubscribers } from "./index.js";
import { globals } from "../appState";


class Computed {
    constructor(getter) {
        this.dirty = false;
        this.cached = null;
        // upstream reactives
        this.deps = new Set();
        // downstream subscribers
        this.dependents = new Set();
        this.getter = getter;
    }

    _compute() {
        // clean up, unsubscribe from existing deps
        for (let dep of this.deps) {

            const subscriberSet = getPropSubscribers(dep.target, dep.prop);
        }
        // call clear on the `this.deps` set to reset for a fresh collection
        // capture the previous activeSubscriber in case we need to back track up a hierarchy
        let prev = globals.activeSubscriber
        globals.activeSubscriber = this;
        // need to run the getter and then set that to `this.cached`
        this.cached = this.getter();

        // optional
    }

    _invalidate() {
        // check if dirty, if so return
        // set dirty to true
        // loop over dependants (downstream subscribers)
        // if the dependant is a computed call the invalidate method on that computed class instance
        // else it is an effect, in which case call it
    }

    get value() {
        if (!this.dirty) {
            return this.cached;
        }

        this._compute();

        // If activeEffect/activeSubscriber is true, add birectional linking
        if (activeEffect) {
            this.deps

        }
    }
}
