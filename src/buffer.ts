interface IEvent {
    type: string;
    stacktrace: any; // get typing
}

enum EAlertType {
    ALERT = 'ALERT',
    CONSOLE = 'CONSOLE'
}

const DEFAULT_MAX_ALLOWED = 10;
const DEFAULT_BUFFER_MS = 500;
const DEFAULT_ALERT_TYPE = EAlertType.ALERT;

export class Buffer {
    private interval;
    private eventsQueue: IEvent[];
    private maxAllowed: number;
    private bufferMs: number;
    private alertType: EAlertType;
    
    constructor(maxAllowed = DEFAULT_MAX_ALLOWED, 
                bufferMs = DEFAULT_BUFFER_MS, 
                alertType = DEFAULT_ALERT_TYPE) {
        this.interval = null;
        this.eventsQueue = [];
        this.maxAllowed = maxAllowed;
        this.bufferMs = bufferMs;
        this.alertType = alertType;
    }

    addEvent(event) {
        this.eventsQueue.push(event);
    }

    startInterval() {
        this.interval = setInterval(() => {
            if (this.eventsQueue.length > this.maxAllowed) {
                this.alertDeveloper();
            }

            // Reset the events queue
            this.eventsQueue.length = 0;
        }, this.bufferMs)
    }

    stopInterval() {
        clearInterval(this.interval);
    }
    
    alertDeveloper() {
        if (this.alertType === EAlertType.ALERT) {
            alert(this.generateAlertMessage());
        }
        console.error(this.eventsQueue);
    }

    generateAlertMessage() {
        return `Reflow detector triggered\n
            Saw ${this.eventsQueue.length} event(s) within ${this.bufferMs} ms.\n 
            Please see console for more details.`;
    }
}