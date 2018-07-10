import { hello } from '../src/hello';

describe('hello', () => {
    it('should output hello', () => {
        expect(hello()).toBe('hello');
    });
});
