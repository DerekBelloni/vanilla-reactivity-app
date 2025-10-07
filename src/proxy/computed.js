import { getPropSubscribers } from "./index.js";
import { globals } from "../appState";


export class Computed {
    constructor(getter, name = null) {
        this.dirty = true;
        this.cached = null;
        // upstream reactives
        this.deps = new Set();
        // downstream subscribers
        this.dependents = new Set();
        this.getter = getter;
        this.name = name;
    }

    _compute() {
        console.log('[top level _compute, computed name]:', this.name);
        // clean up, unsubscribe from existing deps
        for (let dep of this.deps) {
            console.log('this.deps: ', this.deps);
            // declare subscriber set so since it will be set in conditionally based scoping
            let subscriberSet = null;
            // Since we are maintaining an independent data structure for computeds
            // We need to retrieve the deps that the computed subcribes to out of the weak map
            // for refs and reactives
            console.log('dep in _compute: ', dep)
            if (!!dep.deps && dep.deps.size > 0) {
                for (let dependant of dep.deps) {
                    console.log('dep:', dependant);
                    // subscriberSet = getPropSubscribers(dependant.target, dependant.prop);
                    //subscriberSet.delete(this);
                }
            } else {
                subscriberSet = getPropSubscribers(dep.target, dep.prop);
                console.log('other subscriber sets: ', subscriberSet);
            }
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
        for (let sub of this.dependents) {
            // if the dependant is a computed call the invalidate method on that computed class instance
            if (sub instanceof Computed) {
                //console.log('sub in this.dependents:', sub)
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
