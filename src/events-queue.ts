interface IEvent {
    type: string;
    stacktrace: any; // get typing
}

export interface IConfig {
    maxAllowed?: number;
    intervalMs?: number;
    alertType?: EAlertType
}

export enum EAlertType {
    ALERT = 'ALERT',
    CONSOLE = 'CONSOLE'
}

const DEFAULT_MAX_ALLOWED = 10;
const DEFAULT_INTERVAL_MS = 1500;
const DEFAULT_ALERT_TYPE = EAlertType.ALERT;
const DEFAULT_CONFIG: IConfig = {
    maxAllowed: DEFAULT_MAX_ALLOWED,
    intervalMs: DEFAULT_INTERVAL_MS,
    alertType: DEFAULT_ALERT_TYPE
}

export class EventsQueue {
    private interval: any;
    private queue: IEvent[] = [];
    private maxAllowed: number = DEFAULT_MAX_ALLOWED;
    private intervalMs: number = DEFAULT_INTERVAL_MS;
    private alertType: EAlertType = EAlertType.ALERT;    

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
        this.interval = setInterval(() => {
            if (this.queue.length > this.maxAllowed) {
                this.alertDeveloper();
            }

            // Reset the events queue
            this.queue.length = 0;
        }, this.intervalMs)
    }

    public stopInterval() {
        clearInterval(this.interval);
    }
    
    private alertDeveloper() {
        if (this.alertType === EAlertType.ALERT) {
            window.alert(this.generateAlertMessage());
        }
        window.console.error(this.queue.slice());
    }

    private generateAlertMessage() {
        return `Reflow detector triggered\n\n
            Saw ${this.queue.length} event(s) within ${this.intervalMs} ms.\n 
            Please see console for more details.`;
    }
}