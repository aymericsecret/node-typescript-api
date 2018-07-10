import { requestAPI } from '../src/requestAPI';
jest.mock('request');

describe('requestAPI', () => {

    it('should resolve if request is successful', () => {
        expect.assertions(1);
        return requestAPI('GET', 'success', '/test', '')
            .then((success) => {
                expect(success.data).toEqual('success');
            });

    });

    it('should reject if request is not successful ', () => {
        expect.assertions(1);
        return requestAPI('GET', 'error', '/test', '')
            .then(null, (error) => {
                expect(error.data).toEqual('error');

            });
    });

    it('should trigger callback function if request is successful ', () => {
        const myMock = jest.fn();

        expect.assertions(1);
        return requestAPI('GET', 'success', '/test', '', myMock)
            .then((success) => {
                expect(myMock.mock.calls.length).toBe(1);

            });
    });

    it('should not call any callback function as none passed', () => {
        const myMock = jest.fn();

        expect.assertions(1);
        return requestAPI('GET', 'success', '/test', '')
            .then((success) => {
                expect(myMock.mock.calls.length).toBe(0);

            });
    });
});
