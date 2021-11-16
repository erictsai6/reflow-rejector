import { ReflowRejector } from './index';
import { IConfig, EAlertType } from './events-queue';

const pause = function(pausedMs: number) {
    const promise = new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, pausedMs)
    });
    return promise;
}

/**
 * createDivsAndCalculateOffset
 * 
 * Creates n divs and appends it to the body.  
 * Then iterates through each div and calculates the offsetLeft
 * 
 * @param n - number of divs to create
 */
function createDivsAndCalculateOffset(n: number) {    
    let sumOffsetLeft = 0; // No purpose
    for (let i = 0; i < n; i++) {
        const div = document.createElement('div');
        div.innerText = `Special div: ${i}`;
        document.body.appendChild(div);      

        sumOffsetLeft += div.offsetLeft;
    } 
}

describe('Integration Test', () => {
    let config: IConfig;
    let alertSpy: any;
    let consoleSpy: any;

    beforeEach(() => {
        config = {
            maxAllowed: 5,
            intervalMs: 80,
            alertType: EAlertType.ALERT
        };
        alertSpy = spyOn(window, 'alert');

        // Suppress the error messages
        consoleSpy = spyOn(window.console, 'error');        
        ReflowRejector.initialize(config);
    });

    afterEach(() => {
        ReflowRejector.teardown();        
        document.body.innerHTML = '';
    });
    describe('Given an exceeded number of events - ', () => {

        it('should alert the developer that they are abusing reflows', async () => {
            createDivsAndCalculateOffset(10);            
            await pause(100);
            expect(alertSpy).toHaveBeenCalled();
        });
    });

    describe('Given a number of events below the threshold - ', () => {
        it('should NOT alert the developer and everything should be fine', async () => {
            createDivsAndCalculateOffset(1);            
            await pause(100);
            expect(alertSpy).not.toHaveBeenCalled();
        });
    });
});