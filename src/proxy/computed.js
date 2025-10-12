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
            let subscriberSet = null;
            console.log('dep in _compute: ', dep)
            if (!!dep.deps && dep.deps.size > 0) {
                if (dep.dependents.has(this)) {
                    dep.dependents.delete(this);
                }
            } else {
                subscriberSet = getPropSubscribers(dep.target, dep.prop);
                console.log('other subscriber sets: ', subscriberSet);
                //  subscriberSet.delete(this);
            }
        }
        this.deps.clear();
        let prev = globals.activeSubscriber
        globals.activeSubscriber = this;
        this.cached = this.getter();
        globals.activeSubscriber = prev;
        this.dirty = false;
    }


    _invalidate() {
        // check if dirty, if so return
        if (this.dirty) return;
        // set dirty to true
        this.dirty = true;
        // loop over dependants (downstream subscribers)
        const computedSubs = [];
        const effects = [];
        for (let sub of this.dependents) {
            // if the dependant is a computed call the invalidate method on that computed class instance
            if (sub instanceof Computed) {
                console.log('sub in this.dependents:', sub)
                //sub._invalidate();
                computedSubs.push(sub);
            } else {
                // else it is an effect, in which case call it
                //sub();
                effects.push(sub);
            }
        }

        computedSubs.forEach((sub) => sub._invalidate);
        effects.forEach((sub) => sub());
    }


    get value() {
        console.log('----------------------------------------------------------------------------------');
        if (this.dirty) {
            this._compute();
        }
        console.log('computed name in get: ', this.name);
        if (globals.activeSubscriber) {
            console.log('there is an active subscriber')
            this.dependents.add(globals.activeSubscriber);
            if (globals.activeSubscriber instanceof Computed) {
                console.log('global subscriber:', globals.activeSubscriber);
                console.log('active computed instance: ', this);
                globals.activeSubscriber.deps.add(this);
            }
        }
        console.log('cached in computed get: ', this.cached);

        console.log('--------------------------------------------------------------------------------');
        return this.cached;
    }
}
