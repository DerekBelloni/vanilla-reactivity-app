export class CleanupRegistry {
    constructor() {
        this.registry = new FinalizationRegistry((val) => {
            console.log('value has been garbage collected', val)
            this.cleanupStaleDeps();
        });
    }

    cleanupStaleDeps() {

    }

    registerItem(item, info) {
        this.registry.register(item, info);
    }
}
