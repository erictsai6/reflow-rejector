import { getRenamedProperty } from './utils';

describe('Utils <Unit Test>', () => {
    describe('#getRenamedProperty', () => {
        it('Should return a new version of the original property name', () => {
            const expected = '_original_offsetLeft_';
            const actual = getRenamedProperty('offsetLeft');
            expect(expected).toEqual(actual);
        });
    });
});