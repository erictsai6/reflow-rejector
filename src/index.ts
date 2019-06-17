import { elementWrapper } from './element.ts';

const originalCreateElement = document.createElement;
document.createElement = (arg, ...otherArgs) => {
    const element = originalCreateElement(arg, ...otherArgs);
    elementWrapper(element);
    return element;
}