import { EventsQueue } from './events-queue';
import { getRenamedProperty } from './utils';

const buffer = EventsQueue.getInstance();

// Reference link: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
const HTMLELEMENT_PROPERTIES = [
    // Box metrics
    'offsetLeft',
    'offsetTop',
    'offsetWidth',
    'offsetHeight',
    'offsetParent'
];
const ELEMENT_PROPERTIES = [
    'scrollWidth',
    'scrollHeight',
    'scrollLeft',
    'scrollTop'
];

const ELEMENT_METHODS = [
    'getClientRects',
    'getBoundingClientRect',
    'scrollBy',
    'scrollTo',
    'scrollIntoView', 
    'scrollIntoViewIfNeeded'
];

const WINDOW_PROPERTIES = [
    'scrollX',
    'scrollY',
    'innerHeight',
    'innerWidth'
];

const WINDOW_METHODS: string[] = [
    // 'getComputedStyle',
    // 'getMatchedCSSRules'
]

export function elementWrapper() {
    for (const property of HTMLELEMENT_PROPERTIES) {
        defineObjectProperty(HTMLElement.prototype, property);
    }
    for (const property of ELEMENT_PROPERTIES) {
        defineObjectProperty(Element.prototype, property);
    }
    for (const method of ELEMENT_METHODS) {
        defineObjectMethod(Element.prototype, method);
    }
    for (const property of WINDOW_PROPERTIES) {
        defineObjectProperty(window, property);
    }
    for (const method of WINDOW_METHODS) {
        defineObjectMethod(window, method);
    }
}

export function undoElementWrapper() {
    for (const property of HTMLELEMENT_PROPERTIES) {
        undoDefineObjectProperty(HTMLElement.prototype, property);
    }
    for (const property of ELEMENT_PROPERTIES) {
        undoDefineObjectProperty(Element.prototype, property);
    }
    for (const method of ELEMENT_METHODS) {
        undoDefineObjectMethod(Element.prototype, method);
    }
    for (const property of WINDOW_PROPERTIES) {
        undoDefineObjectProperty(window, property);
    }
    for (const method of WINDOW_METHODS) {
        undoDefineObjectMethod(window, method);
    }
}

function defineObjectProperty(objectPrototype: any, property: string) {
    const renamedPropertyName = getRenamedProperty(property);
    const originalImplementation = Object.getOwnPropertyDescriptor(objectPrototype, property);
    if (!originalImplementation) {
        console.warn(`Invalid ${objectPrototype.toString()} property passed in: ${property} - could be a browser thing.`);
        return;
    }
    Object.defineProperty(objectPrototype, renamedPropertyName, originalImplementation);
    Object.defineProperty(objectPrototype, property, {
        set: function(value) {
            const stacktrace = (new Error()).stack;
            buffer.addEvent({
                type: property,
                stacktrace
            });
            return this[renamedPropertyName] = value;
        },
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

function defineObjectMethod(objectPrototype: any, method: string) {
    const renamedMethod = getRenamedProperty(method);
    const originalImplementation = objectPrototype[method];
    if (!originalImplementation) {
        console.warn(`Invalid ${objectPrototype.toString()} method passed in: ${method} - could be a browser thing.`);
        return;
    }
    objectPrototype[renamedMethod] = originalImplementation;
    objectPrototype[method] = function(...args: any) {
        const stacktrace = (new Error()).stack;
        buffer.addEvent({
            type: method,
            stacktrace
        });
        return objectPrototype[renamedMethod](...args);
    }
}

function undoDefineObjectProperty(objectPrototype: any, property: string) {
    const renamedPropertyName = getRenamedProperty(property);
    const originalImplementation = Object.getOwnPropertyDescriptor(objectPrototype, renamedPropertyName);
    if (!originalImplementation) {
        console.warn(`Invalid ${objectPrototype.toString()} property passed in: ${property}, could not UNDO it - could be a browser thing.`);
        return;
    }
    Object.defineProperty(objectPrototype, property, originalImplementation);
    delete objectPrototype[renamedPropertyName];
}

function undoDefineObjectMethod(objectPrototype: any, method: string) {
    const renamedMethod = getRenamedProperty(method);
    const originalImplementation = objectPrototype[renamedMethod];
    if (!originalImplementation) {
        console.warn(`Invalid ${objectPrototype.toString()} method passed in: ${method}, could not UNDO it - could be a browser thing.`);
        return;
    }
    objectPrototype[method] = originalImplementation;
    delete objectPrototype[renamedMethod];
}