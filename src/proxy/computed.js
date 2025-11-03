import { getPropSubscribers, track, trigger } from "./index.js";
import { globals } from "../appState";


export class Computed {
    constructor(getter, name = null) {
        this.dirty = true;
        this.cached = null;
        // upstream reactives
        // this.deps = new Set();
        // downstream subscribers
        // this.dependents = new Set();
        this.getter = getter;
        this.name = name;
    }

    _compute() {
        // clean up, unsubscribe from existing deps





        // OLD
        // for (let dep of this.deps) {
        // let subscriberSet = null;
        // if (!!dep.deps && dep.deps.size > 0) {
        // if (dep.dependents.has(this)) {
        // dep.dependents.delete(this);
        // }
        // } else {
        // subscriberSet = getPropSubscribers(dep.target, dep.prop);
        //subscriberSet.delete(this);
        // }
        // }

        // NEW
        // Loop over dependents
        // Check upstream (reactives) that are subscribed to this instance and remove thatdependancy
        // Check downstream subcribers (other effects and computeds) and remove those subscribers dependancy on this instance
        console.log("computed name:", this.name);
        let depsMap = getPropSubscribers(this);
        console.log('depsMap in computed:', depsMap);









        //this.deps.clear();
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
        console.log('in get in computed');
        if (this.dirty) {
            console.log('is dirty');
            this._compute();
        }
        if (globals.activeSubscriber) {
            //this.dependents.add(globals.activeSubscriber);
            track(this, 'computed')


            if (globals.activeSubscriber instanceof Computed) {
                //globals.activeSubscriber.deps.add(this);
            }
        }

        return this.cached;
    }
}
