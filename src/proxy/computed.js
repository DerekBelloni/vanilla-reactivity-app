import { getPropSubscribers } from "./index.js";
import { globals } from "../appState";


export class Computed {
    constructor(getter) {
        this.dirty = true;
        this.cached = null;
        // upstream reactives
        this.deps = new Set();
        // downstream subscribers
        this.dependents = new Set();
        this.getter = getter;
    }

    _compute() {
        console.log('in computed')
        // clean up, unsubscribe from existing deps
        for (let dep of this.deps) {
            // Since we are maintaining an independent data structure for computeds
            // We need to retrieve the deps that the computed subcribes to out of the weak map
            // for refs and reactives
            const subscriberSet = getPropSubscribers(dep.target, dep.prop);
            // Then delete this class instance from the the subscriber set
            subscriberSet.delete(this);
        }
        // call clear on the `this.deps` set to reset for a fresh collection
        this.deps.clear();
        // capture the previous activeSubscriber in case we need to back track up a hierarchy
        let prev = globals.activeSubscriber
        // set the global active subscriber to this class instance
        globals.activeSubscriber = this;
        // need to run the getter and then set that to `this.cached`
        this.cached = this.getter();
        // reset the global active subscriber to prev
        globals.activeSubscriber = prev;
        // set dirty to false
        this.dirty = false;
    }

    _invalidate() {
        // check if dirty, if so return
        if (this.dirty) return;
        // set dirty to true
        this.dirty = true;
        // loop over dependants (downstream subscribers)
        for (let sub in this.dependents) {
            // if the dependant is a computed call the invalidate method on that computed class instance
            if (sub instanceof Computed) {
                sub._invalidate();
            } else {
                // else it is an effect, in which case call it
                sub();
            }

        }
    }

    get value() {
        if (this.dirty) {
            this._compute();
        }

        if (globals.activeSubscriber) {
            this.dependents.add(globals.activeSubscriber);
            if (globals.activeSubscriber instanceof Computed) {
                globals.activeSubscriber.deps.add(this);
            }
        }

        return this.cached;
    }
}
