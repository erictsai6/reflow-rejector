import { Buffer } from './buffer.ts';

const buffer = new Buffer();

export function elementWrapper(element: HTMLElement) {
    defineObjectProperty(element, 'offsetLeft');
}

function defineObjectProperty(element: HTMLElement, property: string) {
    const originalPropertyName = `_original_${property}_`;
    element[originalPropertyName] = element[property];
    Object.defineProperty(element, property, {
        get: () => {
            const stacktrace = (new Error()).stack;
            buffer.addEvent({
                type: property,
                stacktrace
            });
            return element[originalPropertyName];
        }
    })
}

// function defineObjectMethod(element, property) {
//     Object.defineProperty()
// }