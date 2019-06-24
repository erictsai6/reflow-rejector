import { elementWrapper, undoElementWrapper } from './element';
import { getRenamedProperty } from './utils';

describe('Element <Unit Test>', () => {
    beforeEach(() => {
        elementWrapper();
    })
    afterEach(() => {
        undoElementWrapper();
    });
    describe('#elementWrapper', () => {
        it('should replace all properties/methods that force a reflow (assert their renamed properties exist)', () => {
            const htmlElementPrototype: any = HTMLElement.prototype;
            const elementPrototype: any = Element.prototype;
            expect(Object.getOwnPropertyDescriptor(htmlElementPrototype, '_original_offsetLeft_')).toBeTruthy();
            expect(Object.getOwnPropertyDescriptor(htmlElementPrototype, '_original_offsetTop_')).toBeTruthy();
            expect(Object.getOwnPropertyDescriptor(htmlElementPrototype, '_original_offsetWidth_')).toBeTruthy();
            expect(Object.getOwnPropertyDescriptor(htmlElementPrototype, '_original_offsetHeight_')).toBeTruthy();
            expect(Object.getOwnPropertyDescriptor(htmlElementPrototype, '_original_offsetParent_')).toBeTruthy();
            expect(Object.getOwnPropertyDescriptor(elementPrototype, '_original_scrollWidth_')).toBeTruthy();
            expect(Object.getOwnPropertyDescriptor(elementPrototype, '_original_scrollHeight_')).toBeTruthy();
            expect(Object.getOwnPropertyDescriptor(elementPrototype, '_original_scrollLeft_')).toBeTruthy();
            expect(Object.getOwnPropertyDescriptor(elementPrototype, '_original_scrollTop_')).toBeTruthy();
            expect(elementPrototype._original_getClientRects_).toBeTruthy();
            expect(elementPrototype._original_getBoundingClientRect_).toBeTruthy();
            expect(elementPrototype._original_scrollBy_).toBeTruthy();
            expect(elementPrototype._original_scrollTo_).toBeTruthy();
            expect(elementPrototype._original_scrollIntoView_).toBeTruthy();
            expect(elementPrototype._original_scrollIntoViewIfNeeded_).toBeTruthy();
            expect(Object.getOwnPropertyDescriptor(window, '_original_scrollX_')).toBeTruthy();
            expect(Object.getOwnPropertyDescriptor(window, '_original_scrollY_')).toBeTruthy();
            expect(Object.getOwnPropertyDescriptor(window, '_original_innerHeight_')).toBeTruthy();
            expect(Object.getOwnPropertyDescriptor(window, '_original_innerWidth_')).toBeTruthy();
        });
    });
});
