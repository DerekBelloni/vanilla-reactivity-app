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
        //console.log('[top level _compute, computed name]:', this.name);
        // clean up, unsubscribe from existing deps
        for (let dep of this.deps) {
            //console.log('this.deps: ', this.deps);
            let subscriberSet = null;
            //console.log('dep in _compute: ', dep)
            if (!!dep.deps && dep.deps.size > 0) {
                if (dep.dependents.has(this)) {
                    dep.dependents.delete(this);
                }
            } else {
                subscriberSet = getPropSubscribers(dep.target, dep.prop);
                //           console.log('other subscriber sets: ', subscriberSet);
                //subscriberSet.delete(this);
            }
        }
        this.deps.clear();
        let prev = globals.activeSubscriber
        globals.activeSubscriber = this;
        this.cached = this.getter();
        globals.activeSubscriber = prev;
        this.dirty = false;
    }


    // _invalidate() {
    //   if (this.dirty) return;
    //   this.dirty = true;
    //   const computedSubs = [];
    //   const effects = [];
    //   for (let sub of this.dependents) {
    //       if (sub instanceof Computed) {
    //           computedSubs.push(sub);
    //       } else {
    //           effects.push(sub);
    //       }
    //   }

    //   computedSubs.forEach((sub) => sub._invalidate());
    //   effects.forEach((sub) => sub());
    // }


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
