import * as request from 'supertest';
import app from '../../src/App';
import config from '../../src/config/config';
import IConfig from '../../src/config/configInterface';
import { requestAPI } from '../../src/requestAPI';
jest.mock('../../src/requestAPI');
// import { getPageFromAPI, requestAPI } from '../../src/requestAPI';

import WordpressRouter from '../../src/routes/wordpress';
const Config = config();

/**
 * Testing internal functions
 */
describe('constructor', () => {
    it('should call attachRoutes once', async () => {

        // wordpressRouter.initLangEnpoints = jest.fn(() => Promise.resolve(true));
        const spy = jest.spyOn(WordpressRouter, 'attachRoutes');
        // expect.assertions(1);
        const wordpressRouter = new WordpressRouter();

        expect(spy).toHaveBeenCalledTimes(1);

    });
});

describe('init function', () => {
    const pageNbr = Config.endpoints.length;
    const callNbr = Config.langs.length * pageNbr;
    let wordpressRouter = new WordpressRouter();

    let spy;

    beforeAll(() => {
        jest.resetAllMocks();
        spy = jest.fn();
    });
    afterEach(() => {
        jest.restoreAllMocks();
        wordpressRouter = new WordpressRouter();
    });

    it('should not have been called at declaration', async () => {
        spy = jest.spyOn(wordpressRouter, 'init');
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should be resolved and return the resolved value if everything wen well', async () => {

        wordpressRouter.initLangEnpoints = jest.fn(() => Promise.resolve(true));
        spy = jest.spyOn(wordpressRouter, 'initLangEnpoints');

        expect.assertions(3);
        // Same result : two ways. First one doesn't work if Promise is rejected.
        // In this case, use second method.
        // Await method more if result is a Promise

        // First method
        // const data = await wordpressRouter.init();
        // expect(data).toBe(true);

        // Second method
        return wordpressRouter.init()
            .then((result: {success, error}) => {
                expect(result.success.length).not.toBe(0);
                expect(result.error.length).toBe(0);
                expect(spy).toHaveBeenCalledTimes(callNbr);
            });
    });

    it('should be rejected and return false something went wrong', async () => {

        wordpressRouter.initLangEnpoints = jest.fn(() => Promise.reject(false));
        spy = jest.spyOn(wordpressRouter, 'initLangEnpoints');

        expect.assertions(3);
        return wordpressRouter.init()
            .then(null, (result) => {
                expect(result.success.length).toBe(0);
                expect(result.error.length).not.toBe(0);
                expect(spy).toHaveBeenCalledTimes(callNbr);
            });

    });

    it('should call initCountAnswers once', async () => {

        wordpressRouter.initLangEnpoints = jest.fn(() => Promise.resolve(true));
        spy = jest.spyOn(wordpressRouter, 'initCountAnswers');

        expect.assertions(2);
        return wordpressRouter.init()
            .then((result) => {
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).not.toHaveBeenCalledTimes(2);

            });

    });

    it('should call initExpiration once', async () => {

        wordpressRouter.initLangEnpoints = jest.fn(() => Promise.resolve(true));
        spy = jest.spyOn(wordpressRouter, 'initExpiration');

        expect.assertions(2);
        return wordpressRouter.init()
            .then((result) => {
                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).not.toHaveBeenCalledTimes(2);

            });

    });

    it('should call initLangEnpoints once', async () => {

        wordpressRouter.initLangEnpoints = jest.fn(() => Promise.resolve(true));
        spy = jest.spyOn(wordpressRouter, 'initLangEnpoints');

        expect.assertions(2);
        return wordpressRouter.init()
            .then((result) => {
                expect(spy).toHaveBeenCalledTimes(callNbr);
                expect(spy).not.toHaveBeenCalledTimes(callNbr + 1);

            });

    });

    it('should call checkCountAnswer once per initLangEndpoints calls', () => {
        // const callNbr = Config.langs.length;
        spy = jest.spyOn(wordpressRouter, 'checkCountAnswer');

        expect.assertions(1);
        return wordpressRouter.init()
            .then((result) => {
                expect(spy).toHaveBeenCalledTimes(callNbr);
            });
    });
});

describe('getWpStorage', () => {
    it('should have the expiration according to config', () => {
        const wordpressRouter = new WordpressRouter();
        const time = new Date();
        const expiration = Config.expiration;

        const expectedResult = wordpressRouter.initExpiration(Config.expiration);
        const actualResult = wordpressRouter.getWpStorage();

        expect(actualResult.expiration).toBe(expectedResult);
    });
});

describe('getWpStorageTmp', () => {
    let wordpressRouter = new WordpressRouter();
    beforeAll(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        wordpressRouter = new WordpressRouter();
    });

    it('should have the expiration according to config', () => {

        const time = new Date();
        const expiration = Config.expiration;

        const expectedResult = wordpressRouter.initExpiration(Config.expiration);
        const actualResult = wordpressRouter.getWpStorageTmp();

        expect(actualResult.expiration).toBe(expectedResult);
    });

    it('should have the langs list initialized', async () => {
        const langs = Config.langs;

        expect.assertions(langs.length + 2);
        return wordpressRouter.init()
            .then((result: {success, error}) => {
                const actualResult = wordpressRouter.getWpStorageTmp();
                expect(result.success.length).not.toBe(0);
                expect(actualResult).toBeDefined();
                langs.forEach((lang) => {
                    expect(actualResult[lang]).toBeDefined();
                });
            });
    });
});

describe('sizeOf method', () => {
    it('should return object\'s number of keys (length)', () => {
        // const wordpressRouter = new WordpressRouter();
        const object = {
            name: 'myName',
            test: 'test',
        };

        const expectedResult = 2;
        const actualResult = WordpressRouter.sizeOf(object);

        expect(actualResult).toBe(expectedResult);
        expect(actualResult).not.toBe(1);
    });
});

describe('getParams method', () => {

    it('should transform an object into a string', () => {
        const object = {
            category: 'my-category',
            slug: 'my-slug',
        };

        const expectedResult = 'category=my-category&slug=my-slug';
        const actualResult = WordpressRouter.getParams(object);

        expect(typeof actualResult).toBe('string');
        expect(actualResult).toBe(expectedResult);
    });

    it('should return null if o param passed', () => {
        const object = {};

        const expectedResult = null;
        const actualResult = WordpressRouter.getParams(object);

        expect(actualResult).toBe(null);
    });
});

describe('initExpiration method', () => {
    it('should set the expiration date according to the config exporation value', () => {
        const wordpressRouter = new WordpressRouter();
        const time = new Date();
        const expiration = 30;

        wordpressRouter.initExpiration(expiration);

        const expectedResult = time.getTime() + expiration;
        const actualResult = wordpressRouter.getWpStorage();

        expect(actualResult.expiration).toBeLessThanOrEqual(expectedResult);
    });
});

describe('checkExpiration method', () => {

    it('should return false if the expiration is not passed', () => {
        const wordpressRouter = new WordpressRouter();
        const time = new Date();
        const expiration = 30;

        wordpressRouter.initExpiration(expiration);
        const wpStorage = wordpressRouter.getWpStorage();

        const expectedResult = time.getTime() + expiration;
        const actualResult = wordpressRouter.checkExpiration(wpStorage.expiration);

        expect(actualResult).toBe(false);
    });

    it('should return true if the expiration is passed', () => {
        const wordpressRouter = new WordpressRouter();
        const time = new Date();
        const expiration = 0;

        wordpressRouter.initExpiration(expiration);
        const wpStorage = wordpressRouter.getWpStorage();

        const expectedResult = time.getTime() + expiration;
        const actualResult = wordpressRouter.checkExpiration(wpStorage.expiration);
        expect(actualResult).toBe(true);
    });

    it('should trigger callback function', () => {
        const mockCallback = jest.fn();
        const wordpressRouter = new WordpressRouter();
        const time = new Date();
        const expiration = 0;

        wordpressRouter.initExpiration(expiration);
        const wpStorage = wordpressRouter.getWpStorage();

        wordpressRouter.checkExpiration(wpStorage.expiration, mockCallback);

        expect(mockCallback.mock.calls.length).toBe(1);
    });
});

describe('initLangEnpoints methods', () => {
    let wordpressRouter = new WordpressRouter();
    let spy;

    beforeAll(() => {
        jest.resetAllMocks();
        spy = jest.fn();
    });
    afterEach(() => {
        spy.mockRestore();
        wordpressRouter = new WordpressRouter();
    });

    it('should init wpStorageTmp with a lang value if undefined', () => {
        const lang = 'en';
        const endpoint = 'pages';
        let wpStorage = wordpressRouter.getWpStorageTmp();
        expect(wpStorage[lang]).toBe(undefined);

        wordpressRouter.initLangEnpoints(lang, endpoint);

        wpStorage = wordpressRouter.getWpStorageTmp();
        expect(wpStorage[lang]).not.toBe(undefined);
    });

    it('should init wpStorageTmp with a lang value and endpoint if undefined', () => {
        const lang = 'en';
        const endpoint1 = 'test';
        const endpoint2 = 'nocallback';
        let wpStorage = wordpressRouter.getWpStorageTmp();
        // Trying to test line 356..
        // wpStorage[endpoint1] = {};
        // wpStorage[endpoint2] = undefined;

        expect.assertions(7);
        expect(wpStorage[lang]).toBe(undefined);

        return wordpressRouter.initLangEnpoints(lang, endpoint1)
            .then((result) => {
                wpStorage = wordpressRouter.getWpStorageTmp();
                expect(wpStorage[lang]).not.toBe(undefined);
                expect(wpStorage[lang][endpoint1]).not.toBe(undefined);
                expect(wpStorage[lang][endpoint1]).not.toBe({});
                expect(wpStorage[lang][endpoint2]).toBe(undefined);
                return wordpressRouter.initLangEnpoints(lang, endpoint2)
                    .then((result) => {
                        wpStorage = wordpressRouter.getWpStorageTmp();
                        expect(wpStorage[lang][endpoint2]).not.toBe(undefined);
                        expect(wpStorage[lang][endpoint2]).toEqual({});
                    });
            });
    });

    it('should not init wpStorageTmp[endoint] already defined', () => {
        const lang = 'en';
        const endpoint1 = 'test';
        let wpStorage = wordpressRouter.getWpStorageTmp();

        expect.assertions(6);
        expect(wpStorage[lang]).toBe(undefined);

        return wordpressRouter.initLangEnpoints(lang, endpoint1)
            .then((result) => {
                wpStorage = wordpressRouter.getWpStorageTmp();
                expect(wpStorage[lang]).not.toBe(undefined);
                expect(wpStorage[lang][endpoint1]).not.toBe(undefined);
                expect(wpStorage[lang][endpoint1]).not.toBe({});
                return wordpressRouter.initLangEnpoints(lang, endpoint1)
                    .then((result) => {
                        wpStorage = wordpressRouter.getWpStorageTmp();
                        expect(wpStorage[lang][endpoint1]).not.toBe(undefined);
                        expect(wpStorage[lang][endpoint1]).not.toBe({});
                    });
            });
    });

    it('should call addCountAnswer once', () => {
        const lang = 'en';
        const endpoint = 'pages';
        spy = jest.spyOn(wordpressRouter, 'addCountAnswer');

        expect.assertions(1);
        return wordpressRouter.initLangEnpoints(lang, endpoint)
            .then((result) => {
                expect(spy).toHaveBeenCalledTimes(1);
            });

    });

    it('should call checkCountAnswer once if call is successful', () => {
        const lang = 'en';
        const endpoint = 'pages';
        spy = jest.spyOn(wordpressRouter, 'checkCountAnswer');

        expect.assertions(1);
        return wordpressRouter.initLangEnpoints(lang, endpoint)
            .then((result) => {
                expect(spy).toHaveBeenCalledTimes(1);
            });

    });

    it('should call checkCountAnswer if call is not successful', () => {
        const lang = 'en';
        const endpoint = 'fail';
        spy = jest.spyOn(wordpressRouter, 'checkCountAnswer');

        expect.assertions(1);
        return wordpressRouter.initLangEnpoints(lang, endpoint)
            .then(null, (result) => {
                expect(spy).toHaveBeenCalledTimes(1);
            });

    });
});

describe('initCountAnswers methods', () => {
    let wordpressRouter;
    beforeAll(() => {
        jest.resetAllMocks();
        wordpressRouter = new WordpressRouter();
    });

    it('should set public variables answersTotal and answerCount to 0', () => {
        const initValues = [1, 2];
        wordpressRouter.answerCount = initValues[0];
        wordpressRouter.answersTotal = initValues[1];

        wordpressRouter.initCountAnswers();

        expect(wordpressRouter.answerCount).toBe(0);
        expect(wordpressRouter.answersTotal).toBe(0);
        expect(wordpressRouter.answerCount).not.toBe(initValues[0]);
        expect(wordpressRouter.answersTotal).not.toBe(initValues[1]);
    });

    // TODO: Test failing, addcountAnswer in initLangEndpoint not triggered
    // it('should increase by 1 answersTotal but not answersCount after class init', () => {
    //     expect.assertions(2);
    //     return wordpressRouter.init()
    //         .then((result) => {
    //             expect(wordpressRouter.answerCount).not.toBe(0);
    //             expect(wordpressRouter.answersTotal).toBe(0);
    //         });
    // });
});

describe('addCountAnswer methods', () => {
    let wordpressRouter;
    beforeAll(() => {
        jest.resetAllMocks();
        wordpressRouter = new WordpressRouter();
    });
    afterEach(() => jest.restoreAllMocks());
    it('should increase by 1 answersTotal but not answersCount', () => {
        // const langNbr = Config.langs.length;
        wordpressRouter.initCountAnswers();

        const answerCount = wordpressRouter.answerCount;
        const answersTotal = wordpressRouter.answersTotal;

        wordpressRouter.addCountAnswer();
        expect(wordpressRouter.answersTotal).toBe(1);
    });
    it('should increase by 1 answersTotal but not answersCount after class init', () => {
        wordpressRouter.initCountAnswers();
        const langs = Config.langs;

        expect.assertions(1);
        return wordpressRouter.init()
            .then((result) => {
                const answerCount = wordpressRouter.answerCount;
                const answersTotal = wordpressRouter.answersTotal;

                wordpressRouter.addCountAnswer();
                expect(wordpressRouter.answersTotal).toBe(1);
            });
    });
});

describe('checkCountAnswer methods', () => {
    let wordpressRouter = new WordpressRouter();
    let spy;

    beforeAll(() => {
        jest.resetAllMocks();
        spy = jest.fn();
    });
    afterEach(() => {
        jest.restoreAllMocks();
        wordpressRouter = new WordpressRouter();
    });

    it('should call initCountAnswers when answersCount == answersTotal', () => {
        const callNbr = Config.langs.length;
        spy = jest.spyOn(wordpressRouter, 'initCountAnswers');
        wordpressRouter.answerCount = 1;
        wordpressRouter.answersTotal = 2;

        wordpressRouter.checkCountAnswer();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should replace wpStorage by wpStorageTmp when answersCount >= answersTotal', () => {
        const callNbr = Config.langs.length;
        spy = jest.spyOn(wordpressRouter, 'initCountAnswers');

        const expectedResult = wordpressRouter.getWpStorageTmp();
        const actualResult = wordpressRouter.getWpStorage();

        expect.assertions(3);
        expect(actualResult).toEqual(expectedResult);

        return wordpressRouter.init()
            .then((result) => {
                // This is not true anymore, i don't get why..
                // expect(actualResult).toEqual(expectedResult);
                const expectedResultNew = wordpressRouter.getWpStorageTmp();
                const actualResultNew = wordpressRouter.getWpStorage();

                expect(actualResultNew).toEqual(expectedResultNew);
                expect(actualResult).not.toEqual(actualResultNew);
            });
    });

    it('should return true answersCount == answersTotal', () => {
        const callNbr = Config.langs.length;

        wordpressRouter.answerCount = 1;
        wordpressRouter.answersTotal = 2;

        const actualResult = wordpressRouter.checkCountAnswer();
        const expectedResult = true;
        expect(actualResult).toBe(expectedResult);
    });

    it('should return false answersCount < answersTotal', () => {
        const callNbr = Config.langs.length;

        wordpressRouter.answerCount = 0;
        wordpressRouter.answersTotal = 2;

        const actualResult = wordpressRouter.checkCountAnswer();
        const expectedResult = false;
        expect(actualResult).toBe(expectedResult);
    });

    it('should increase answerCount by 1', () => {
        const callNbr = Config.langs.length;

        wordpressRouter.answerCount = 0;

        wordpressRouter.checkCountAnswer();

        const actualResult = wordpressRouter.answerCount;
        const expectedResult = 1;

        expect(actualResult).toBe(expectedResult);
    });
});

/**
 * Testing api calls
 */

describe('getData method', () => {
    const spy = jest.spyOn(WordpressRouter, 'sizeOf');
    let wordpressRouter = new WordpressRouter();
    afterEach(() => {
        spy.mockRestore();
        wordpressRouter = new WordpressRouter();
    });

    it('should return 200 if wpStorage[lang][endpoint] exists', () => {
        // WordpressRouter.sizeOf = jest.fn(() => 5);
        // const spy = jest.spyOn(WordpressRouter, 'sizeOf');
        wordpressRouter.setWpStorage({
            en: {
                pages: [],
            },
            expiration: 1000,
        });

        expect.assertions(1);
        return wordpressRouter.init()
            .then((sucess) => {
                const expectedRestul = 200;
                const actualRestul = WordpressRouter.getData(wordpressRouter, 'en', 'pages');
                // expect(spy).toHaveBeenCalled();
                expect(actualRestul).toBe(expectedRestul);
            });
    });

    it('should return 503 if wpStorage[lang] does not exists', () => {
        // WordpressRouter.sizeOf = jest.fn(() => 0);
        // const spy = jest.spyOn(WordpressRouter, 'sizeOf');
        wordpressRouter.setWpStorage({
            en: {
                pages: [],
            },
            expiration: 1000,
        });

        expect.assertions(1);
        return wordpressRouter.init()
            .then((sucess) => {
                const expectedRestul = 503;
                const actualRestul = WordpressRouter.getData(wordpressRouter, 'ch', 'pages');
                // expect(spy).not.toHaveBeenCalled();
                expect(actualRestul).toBe(expectedRestul);
            });
    });

    // it('should return 503 if wpStorage[lang][endpoint] does not exists', () => {
    //     WordpressRouter.sizeOf = jest.fn(() => 0);
    //     const spy = jest.spyOn(WordpressRouter, 'sizeOf');

    //     expect.assertions(2);
    //     return wordpressRouter.init()
    //         .then((sucess) => {
    //             const expectedRestul = 503;
    //             const actualRestul = WordpressRouter.getData(wordpressRouter, 'en', 'failt');
    //             expect(spy).toHaveBeenCalled();
    //             expect(actualRestul).toBe(expectedRestul);
    //         });
    // });

});

describe('wordpress router function getAll', () => {
    it('should return "hello world"', () => {
        return request(app).get('/')
            .expect(200)
            .then((res) => {
                expect(res.type).toBe('application/json');
            });
    });

    it('should return Config default lang if no lang parameters sent in request', () => {
        return request(app).get('/')
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual({lang: Config.defaultLang});
            });
    });

    it('should return lang parameters sent in request', () => {
        return request(app)
            .get('/')
            .query({ lang: 'de-de' })
            .then((response) => {
                // expect(JSON.parse(response.text)).toEqual({lang: 'pt-br'});
                expect(response.body).toEqual({lang: 'de-de'});
            });

    });
});

describe('wordpress router function getPages', () => {
    const endpoint = '/pages';

    it('should return an object', () => {

        return request(app).get(endpoint)
            .expect(200)
            .then((res) => {
                expect(res.type).toBe('application/json');
                expect(res.status).toEqual(200);

                expect(typeof res.body).toBe('object');
            });
    });

    it('should return a mock of a pages in english (default lang en)', () => {

        return request(app).get(endpoint)
            .expect(200)
            .then((res) => {
                expect(res.body[0].id).toBe(1);
            });
    });

    it('should return a mock of a pages in pt as params passed', () => {

        return request(app)
            .get(endpoint)
            .query({ lang: 'pt-br' })
            .expect(200)
            .then((res) => {
                expect(res.body[0].id).toBe(2);
            });
    });

    it('should return 503 if wpStorage not ready (app not started)"', () => {
        WordpressRouter.getData = jest.fn((lang, endpoint) => 503);
        const spy = jest.spyOn(WordpressRouter, 'getData');

        return request(app)
        .get(endpoint)
        .expect(503)
        .then((res) => {
            expect(spy).toHaveBeenCalledTimes(1);
            });
    });

    it('should return 503 if getData had an issue', () => {
        WordpressRouter.getData = jest.fn((lang, endpoint) => null);
        const spy = jest.spyOn(WordpressRouter, 'getData');

        return request(app)
        .get(endpoint)
        .expect(503)
        .then((res) => {
            expect(spy).toHaveBeenCalledTimes(1);
            });
    });

    it('should return 200 if wpStorage ready and filled"', () => {
        WordpressRouter.getData = jest.fn((lang, endpoint) => 200);
        const spy = jest.spyOn(WordpressRouter, 'getData');

        return request(app)
        .get(endpoint)
        .expect(200)
        .then((res) => {
            expect(spy).toHaveBeenCalledTimes(1);
            });
    });
});

describe('wordpress router function getPosts', () => {
    const endpoint = '/posts';

    it('should return an object or an array', () => {

        return request(app).get(endpoint)
            .expect(200)
            .then((res) => {
                expect(res.type).toBe('application/json');
                expect(res.status).toEqual(200);

                expect(typeof res.body).toBe('object');
            });
    });

    it('should return a mock of a pages in english (default lang en)', () => {

        return request(app).get(endpoint)
            .expect(200)
            .then((res) => {
                expect(res.body[0].id).toBe(1);
            });
    });

    it('should return a mock of a pages in pt as params passed', () => {

        return request(app)
            .get(endpoint)
            .query({ lang: 'pt-br' })
            .expect(200)
            .then((res) => {
                expect(res.body[0].id).toBe(2);
            });
    });

    it('should return 503 if wpStorage not ready (app not started)"', () => {
        WordpressRouter.getData = jest.fn((lang, endpoint) => 503);
        const spy = jest.spyOn(WordpressRouter, 'getData');

        return request(app)
        .get(endpoint)
        .expect(503)
        .then((res) => {
            expect(spy).toHaveBeenCalledTimes(1);
            });
    });

    it('should return 503 if getData had an issue', () => {
        WordpressRouter.getData = jest.fn((lang, endpoint) => null);
        const spy = jest.spyOn(WordpressRouter, 'getData');

        return request(app)
        .get(endpoint)
        .expect(503)
        .then((res) => {
            expect(spy).toHaveBeenCalledTimes(1);
            });
    });

    it('should return 200 if wpStorage ready and filled"', () => {
        WordpressRouter.getData = jest.fn((lang, endpoint) => 200);
        const spy = jest.spyOn(WordpressRouter, 'getData');

        return request(app)
        .get(endpoint)
        .expect(200)
        .then((res) => {
            expect(spy).toHaveBeenCalledTimes(1);
            });
    });
});

describe('wordpress router function getCollections', () => {
    const endpoint = '/collection_page';

    it('should return an object or an array', () => {

        return request(app).get(endpoint)
            .expect(200)
            .then((res) => {
                expect(res.type).toBe('application/json');
                expect(res.status).toEqual(200);

                expect(typeof res.body).toBe('object');
            });
    });

    it('should return a mock of a pages in english (default lang en)', () => {

        return request(app).get(endpoint)
            .expect(200)
            .then((res) => {
                expect(res.body[0].id).toBe(1);
            });
    });

    it('should return a mock of a pages in pt as params passed', () => {

        return request(app)
            .get(endpoint)
            .query({ lang: 'pt-br' })
            .expect(200)
            .then((res) => {
                expect(res.body[0].id).toBe(2);
            });
    });

    it('should return 503 if wpStorage not ready (app not started)"', () => {
        WordpressRouter.getData = jest.fn((lang, endpoint) => 503);
        const spy = jest.spyOn(WordpressRouter, 'getData');

        return request(app)
        .get(endpoint)
        .expect(503)
        .then((res) => {
            expect(spy).toHaveBeenCalledTimes(1);
            });
    });

    it('should return 503 if getData had an issue', () => {
        WordpressRouter.getData = jest.fn((lang, endpoint) => null);
        const spy = jest.spyOn(WordpressRouter, 'getData');

        return request(app)
        .get(endpoint)
        .expect(503)
        .then((res) => {
            expect(spy).toHaveBeenCalledTimes(1);
            });
    });

    it('should return 200 if wpStorage ready and filled"', () => {
        WordpressRouter.getData = jest.fn((lang, endpoint) => 200);
        const spy = jest.spyOn(WordpressRouter, 'getData');

        return request(app)
        .get(endpoint)
        .expect(200)
        .then((res) => {
            expect(spy).toHaveBeenCalledTimes(1);
            });
    });
});

describe('wordpress router function getCollections', () => {
    const endpoint = '/home_page';

    it('should return an object or an array', () => {

        return request(app).get(endpoint)
            .expect(200)
            .then((res) => {
                expect(res.type).toBe('application/json');
                expect(res.status).toEqual(200);

                expect(typeof res.body).toBe('object');
            });
    });

    it('should return a mock of a pages in english (default lang en)', () => {

        return request(app).get(endpoint)
            .expect(200)
            .then((res) => {
                expect(res.body[0].id).toBe(1);
            });
    });

    it('should return a mock of a pages in pt as params passed', () => {

        return request(app)
            .get(endpoint)
            .query({ lang: 'pt-br' })
            .expect(200)
            .then((res) => {
                expect(res.body[0].id).toBe(2);
            });
    });

    it('should return 503 if wpStorage not ready (app not started)"', () => {
        WordpressRouter.getData = jest.fn((lang, endpoint) => 503);
        const spy = jest.spyOn(WordpressRouter, 'getData');

        return request(app)
        .get(endpoint)
        .expect(503)
        .then((res) => {
            expect(spy).toHaveBeenCalledTimes(1);
            });
    });

    it('should return 503 if getData had an issue', () => {
        WordpressRouter.getData = jest.fn((lang, endpoint) => null);
        const spy = jest.spyOn(WordpressRouter, 'getData');

        return request(app)
        .get(endpoint)
        .expect(503)
        .then((res) => {
            expect(spy).toHaveBeenCalledTimes(1);
            });
    });

    it('should return 200 if wpStorage ready and filled"', () => {
        WordpressRouter.getData = jest.fn((lang, endpoint) => 200);
        const spy = jest.spyOn(WordpressRouter, 'getData');

        return request(app)
        .get(endpoint)
        .expect(200)
        .then((res) => {
            expect(spy).toHaveBeenCalledTimes(1);
            });
    });
});
