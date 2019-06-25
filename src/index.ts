import { elementWrapper, undoElementWrapper } from './element';
import { EventsQueue } from './events-queue';
import { IConfig } from './events-queue';

let initialized = false;

export class ReflowRejector {
    public static initialize(config?: IConfig) {
        if (initialized) {
            window.console.warn('ReflowRejector has already been initialized, ignoring..');
            return;
        }
        const buffer = EventsQueue.getInstance();
        buffer.setConfig(config);

        elementWrapper();
        buffer.startInterval();
        initialized = true;
    }

    public static teardown() {
        const buffer = EventsQueue.getInstance();

        undoElementWrapper();
        buffer.stopInterval();
        initialized = false;
    }
}