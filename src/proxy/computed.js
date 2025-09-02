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

    _computed() {

    }

    _invalidate() {

    }

    get value() {
        if (!this.dirty) {
            return this.cached;
        }

        // If activeEffect/activeSubscriber is true, add birectional linking
        if (activeEffect) {


        }
    }
}
