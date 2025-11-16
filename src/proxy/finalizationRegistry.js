export class CleanupRegistry {
    constructor() {
        this.registry = new FinalizationRegistry(() => {
            console.log('value has been garbage collected')
        });
    }

    registerItem(item, info) {
        this.registry.register(item, info);
    }
}
