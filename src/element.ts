import { EventsQueue } from './events-queue';
import { getRenamedProperty } from './utils';

const buffer = EventsQueue.getInstance();

// Reference link: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
const ELEMENT_PROPERTIES = [
    // Box metrics
    'offsetLeft',
    'offsetTop',
    'offsetWidth',
    'offsetHeight',
    'offsetParent',
    // 'getClientRects',
    // 'getBoundingClientRect',

    // Scroll - need to differentiate setters
    'scrollWidth',
    'scrollHeight',
    'scrollLeft',
    'scrollTop'
];
const ELEMENT_METHODS = [

];
const WINDOW_PROPERTIES = [

];

export function elementWrapper() {
    for (const property of ELEMENT_PROPERTIES) {
        defineElementProperty(property);
    }
}

function defineElementProperty(property: string) {
    const renamedPropertyName = getRenamedProperty(property);
    const originalImplementation = Object.getOwnPropertyDescriptor(HTMLElement.prototype, property);
    if (!originalImplementation) {
        console.warn(`Invalid element property passed in: ${property} - could be a browser thing.`);
        return;
    }
    Object.defineProperty(HTMLElement.prototype, renamedPropertyName, originalImplementation);
    Object.defineProperty(HTMLElement.prototype, property, {
        get: function() {
            const stacktrace = (new Error()).stack;
            buffer.addEvent({
                type: property,
                stacktrace
            });
            return this[renamedPropertyName];
        }
    });
}