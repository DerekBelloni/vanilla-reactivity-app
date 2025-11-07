import { dependencyChange, getPropSubscribers, track, trigger } from "./index.js";
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
        // NEW
        // Loop over dependents
        // Check upstream (reactives) that are subscribed to this instance and remove that dependancy
        // Check downstream subcribers (other effects and computeds) and remove those subscribers dependancy on this instance
        console.log("computed name:", this.name);
        let depsMap = getPropSubscribers(this, 'computed');
        console.log('depsMap in computed:', depsMap);


        let prev = globals.activeSubscriber
        globals.activeSubscriber = this;
        this.cached = this.getter();
        globals.activeSubscriber = prev;
        this.dirty = false;
    }

    get value() {
        if (this.dirty) {
            this._compute();
        }
        if (globals.activeSubscriber) {
            track(this, 'computed')


            if (globals.activeSubscriber instanceof Computed) {
                console.log('globals in computed get: ', globals.activeSubscriber);
                //globals.activeSubscriber.deps.add(this);
            }
        }

        return this.cached;
    }
}
