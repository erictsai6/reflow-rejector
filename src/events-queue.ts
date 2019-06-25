interface IEvent {
    type: string;
    stacktrace: any; // get typing
}

export interface IConfig {
    maxAllowed?: number;
    intervalMs?: number;
    alertType?: EAlertType;
    alertFrequencyMs?: number;
}

export enum EAlertType {
    ALERT = 'ALERT',
    CONSOLE = 'CONSOLE'
}

const DEFAULT_MAX_ALLOWED = 10;
const DEFAULT_INTERVAL_MS = 1500;
const DEFAULT_ALERT_TYPE = EAlertType.ALERT;
const DEFAULT_ALERT_FREQUENCY_MS = 10 * 60000; // 10 Minutes
const DEFAULT_CONFIG: IConfig = {
    maxAllowed: DEFAULT_MAX_ALLOWED,
    intervalMs: DEFAULT_INTERVAL_MS,
    alertType: DEFAULT_ALERT_TYPE,
    alertFrequencyMs: DEFAULT_ALERT_FREQUENCY_MS
}

export class EventsQueue {
    private interval: any;
    private queue: IEvent[] = [];
    private maxAllowed: number = DEFAULT_MAX_ALLOWED;
    private intervalMs: number = DEFAULT_INTERVAL_MS;
    private alertType: EAlertType = EAlertType.ALERT;    
    private alertFrequencyMs: number = DEFAULT_ALERT_FREQUENCY_MS;

    private lastAlertedTime: Date | null = null;
    private static _instance_: EventsQueue;

    public static getInstance() {
        if (!EventsQueue._instance_) {
            EventsQueue._instance_ =  new EventsQueue();
        }
        return EventsQueue._instance_;
    }

    constructor(config?: IConfig) {
        this.setConfig(config);
    }

    setConfig(config?: IConfig) {
        config = config || {};
        const mergedConfig = {
            ...DEFAULT_CONFIG,
            ...config
        }
        this.interval = null;
        this.queue = [];
        this.maxAllowed = <number>mergedConfig.maxAllowed;
        this.intervalMs = <number>mergedConfig.intervalMs;
        this.alertType = <EAlertType>mergedConfig.alertType;
    }

    public addEvent(event: IEvent) {
        this.queue.push(event);
    }

    public startInterval() {
        if (this.interval) {
            window.console.warn('Events queue interval already started, ignoring..');
            return;
        }
        this.lastAlertedTime = null;
        this.interval = setInterval(() => {
            if (this.shouldAlert()) {
                this.alertDeveloper();
            }

            // Reset the events queue
            this.queue.length = 0;
        }, this.intervalMs)
    }

    public stopInterval() {
        clearInterval(this.interval);
        this.interval = null;
    }
    
    private shouldAlert() {
        return this.queue.length > this.maxAllowed &&
            (!this.lastAlertedTime || 
                new Date(this.lastAlertedTime.getTime() + this.alertFrequencyMs) < new Date());
    }

    private alertDeveloper() {
        if (this.alertType === EAlertType.ALERT) {
            window.alert(this.generateAlertMessage());
        }
        window.console.error(this.queue.slice());
        this.lastAlertedTime = new Date();
    }

    private generateAlertMessage() {
        return `Reflow detector triggered\n\n
            Saw ${this.queue.length} event(s) within ${this.intervalMs} ms.\n 
            Please see console for more details.`;
    }
}