import { elementWrapper } from './element';
import { EventsQueue } from './events-queue';
import { IConfig } from './events-queue';

export class ReflowRejector {
    public static initialize(config?: IConfig) {
        const buffer = EventsQueue.getInstance();
        buffer.setConfig(config);

        elementWrapper();
        buffer.startInterval();
    }

    public static teardown() {
        const buffer = EventsQueue.getInstance();
        buffer.stopInterval();
    }
}