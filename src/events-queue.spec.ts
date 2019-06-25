import { EventsQueue, EAlertType } from './events-queue';

const pause = function(pausedMs: number) {
    const promise = new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, pausedMs)
    });
    return promise;
}

describe('EventsQueue <Unit Test>', () => {
    let TEST_MAX_ALLOWED: number;

    beforeEach(() => {
        TEST_MAX_ALLOWED = 5;
    });

    describe('init', () => {
        it('using the singleton pattern it should reuse the same instance', () => {
            const eventsQueue1 = EventsQueue.getInstance();
            const eventsQueue2 = EventsQueue.getInstance();

            expect(eventsQueue1).toBe(eventsQueue2);
        });
    });

    describe('#startInterval', () => {
        let eventsQueue: EventsQueue;
        let alertSpy: jasmine.Spy;
        let consoleSpy: jasmine.Spy;

        beforeEach(() => {
            eventsQueue = EventsQueue.getInstance();
            eventsQueue.setConfig({
                maxAllowed: TEST_MAX_ALLOWED,
                intervalMs: 10
            });
            alertSpy = spyOn(window, 'alert');
            consoleSpy = spyOn(window.console, 'error');
        });

        afterEach(() => {
            eventsQueue.stopInterval();
        });

        it('if eventsQueue exceeds max allowed events then it should alert ' + 
            'the developer and log the events', async () => {
            for (let i = 0; i < TEST_MAX_ALLOWED + 1; i++) {
                eventsQueue.addEvent({
                    type: 'offsetLeft', 
                    stacktrace: {}
                });
            }
            eventsQueue.startInterval();
            await pause(15);
            
            let args = alertSpy.calls.first().args;
            expect(args[0]).toContain(`${TEST_MAX_ALLOWED + 1} event(s) within 10 ms`);
            args = consoleSpy.calls.first().args;
            expect(args[0].length).toBe(TEST_MAX_ALLOWED + 1);
            expect(args[0][0].type).toBe('offsetLeft'); 

        });

        it('if eventsQueue is below the max allowed then it should just clear the queue', async () => {
            for (let i = 0; i < TEST_MAX_ALLOWED; i++) {
                eventsQueue.addEvent({
                    type: 'offsetLeft', 
                    stacktrace: {}
                });
            }
            eventsQueue.startInterval();
            await pause(15);
            
            expect(alertSpy).not.toHaveBeenCalled();
        });

        it('if eventsQueue exceeds max but alertType is not ALERT then it should ONLY ' + 
             'log the events', async () => {
            eventsQueue.setConfig({
                maxAllowed: TEST_MAX_ALLOWED,
                intervalMs: 10,
                alertType: EAlertType.CONSOLE
            });
            for (let i = 0; i < TEST_MAX_ALLOWED + 1; i++) {
                eventsQueue.addEvent({
                    type: 'offsetLeft', 
                    stacktrace: {}
                });
            }
            eventsQueue.startInterval();
            await pause(15);
            
            expect(alertSpy).not.toHaveBeenCalled();
            let args = consoleSpy.calls.first().args;
            expect(args[0].length).toBe(TEST_MAX_ALLOWED + 1);
            expect(args[0][0].type).toBe('offsetLeft');
        });
    });

    describe('#stopInterval', () => {
        let eventsQueue: EventsQueue;
        let alertSpy: jasmine.Spy;
        let consoleSpy: jasmine.Spy;
       
        beforeEach(() => {
            eventsQueue = EventsQueue.getInstance();
            eventsQueue.setConfig({
                maxAllowed: TEST_MAX_ALLOWED,
                intervalMs: 50
            });
            alertSpy = spyOn(window, 'alert');
            consoleSpy = spyOn(window.console, 'error');
        });


        it('should not error out if interval has not begun', () => {
            eventsQueue.stopInterval();

            // Should not error out - assert that the next statement is hit
            expect(true).toBeTruthy();
        });

        it('should stop an existing interval, validate that no alert is sent even though ' + 
            'there are things in the eventsQueue', async () => {
            for (let i = 0; i < TEST_MAX_ALLOWED + 1; i++) {
                eventsQueue.addEvent({
                    type: 'offsetLeft', 
                    stacktrace: {}
                });
            }
            eventsQueue.startInterval();
            await pause(25);
            eventsQueue.stopInterval();

            expect(alertSpy).not.toHaveBeenCalled();
            expect(consoleSpy).not.toHaveBeenCalled();            
        });
    });

});
