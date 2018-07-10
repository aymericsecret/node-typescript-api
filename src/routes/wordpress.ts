import {NextFunction, Request, Response, Router} from 'express';
import config from '../config/config';
import IStorage from '../config/storageInterface';
import {requestAPI} from '../requestAPI';

const Config = config();

export default class WordpressRouter {

    public static sizeOf = (object: object): number => {
        return Object.keys(object).length;
    }

    public static attachRoutes = (wordpressRouter: WordpressRouter) => {
        wordpressRouter.router.get('/', wordpressRouter.getAll);
        wordpressRouter.router.get('/pages', wordpressRouter.getPages);
        wordpressRouter.router.get('/posts', wordpressRouter.getPosts);
        // wordpressRouter.router.get('/categories', wordpressRouter.getCategories);
        wordpressRouter.router.get('/home_page', wordpressRouter.getHomePage);
        wordpressRouter.router.get('/collection_page', wordpressRouter.getCollections);
    }

    public static getData = (wordpressRouter: WordpressRouter, lang: string, endpoint: string): number => {
        // res.json(this.wpStorage[lang][endpoint]);
        // console.log('endpoint: ' + endpoint);
        // console.log('lang: ' + lang);
        // console.log('length land: ' + WordpressRouter.sizeOf(wordpressRouter.wpStorage[lang]));
        // console.log('length endpoint: ' + wordpressRouter.wpStorage[lang][endpoint].length);

        if (wordpressRouter.wpStorage[lang] !== undefined && wordpressRouter.wpStorage[lang][endpoint] !== undefined) {

            // if (isArray(wordpressRouter.wpStorage[lang][endpoint]) && wordpressRouter.wpStorage[lang][endpoint] !== undefined) {
                wordpressRouter.checkExpiration(wordpressRouter.wpStorage.expiration, wordpressRouter.init);
                return 200;
            // } else {
            //     wordpressRouter.init();
            //     return 503;
            // }
        } else {
            wordpressRouter.init();
            return 503;
        }
    }

    /**
     *
     * @param query - http request query (passed by AngularJS as parameter)
     * @returns {string} - Formatted to be passed as a URL parameter (Ex: www.domain.com?slug=my-slug
     */
    public static getParams = (query: object): string => {
        let params = '';
        const keys = Object.keys(query);
        if (keys.length > 0) {
            keys.forEach((value, key) => {
                params += value + '=' + query[value];
                if (key + 1 < keys.length) {
                    params += '&';
                }
            });
            return params;
        } else {
            return null;
        }
    }

    public router: Router;
    public path: string;
    public WP_URL = Config.wordpress.url;
    // Variable to check how many answers from the WP API were recieved (compared to how many were asked)
    public answersTotal: number;
    public answerCount: number;

    // wpStorage that will be updated when expiration reached, without any impact of the call to the api (this is never sent directly back to an api call, but updates wpStorage when all data has been retrieved)
    private wpStorageTmp: IStorage;
    // wpStorage that will contain the last set of retrieved data (is updated when the whole set of data has been retrieved), in order to send the last set of data even if a new set of data is being retrieved (after an expiration)
    private wpStorage: IStorage;

    /**
     * Initialize the WordpressRouter
     */
    constructor(path = '/') {
        this.router = Router();
        this.path = path;

        this.wpStorageTmp = {
            expiration: null,
        };
        this.wpStorage = {
            expiration: null,
        };
        // this.init();
        WordpressRouter.attachRoutes(this);
    }

    // get WpStorage() { return this.wpStorage; }
    // get WpStorageTmprage() { return this.wpStorageTmp; }
    public getWpStorage = (): IStorage => this.wpStorage;
    public getWpStorageTmp = (): IStorage => this.wpStorageTmp;
    public setWpStorage = (wpStorage): IStorage => this.wpStorage = wpStorage;
    // public setWpStorageTmp = (wpStorageTmp): IStorage => this.wpStorageTmp = wpStorageTmp;

    /**
     *
     * @param expirationDuration
     */
    public initExpiration = (expirationDuration: number): number => {
        const time = new Date();
        const expiration = time.getTime() + expirationDuration; // 1/2 hours
        this.wpStorage.expiration = expiration;
        this.wpStorageTmp.expiration = expiration; // TODO: add this to the RSW API
        return expiration;
    }

    /**
     *
     * @param expiration - The current controller's expiration time
     * @param callback - Initialization function to reset local variables with API's values
     */
    public checkExpiration = (expiration: number, callback?: () => {}): boolean => {
        const date = new Date();
        const time = date.getTime();
        // console.log('not expired: ' + ((expiration - time) / (60 * 1000)));
        if (time >= expiration && typeof callback === 'function') {
            // console.log('expired: ' + ((expiration - time) / (60 * 1000)));
            callback();
        }
        return time >= expiration;
    }

    /**
     * Initialise the counter of answers from the backend to update the set of data to answer to the API calls
     */
    public initCountAnswers = () => {
        this.answersTotal = 0;
        this.answerCount = 0;
        // console.log('Count Answers - Initialization', this.answerCount, this.answersTotal);
    }

     /**
      * Updates the number of answers to wait for before updating the set of data to answer to the API calls
      */
    public addCountAnswer = () => {
        this.answersTotal++;
    }

    /**
     * Checks the difference between the number of answers that we should have from the backend and the actual answers we got. When this number is reached, we update the set of data to send back to the API calls
     */
    public checkCountAnswer = (isSuccess: boolean = true) => {
        if (!isSuccess) {
            // TODO: error while retrieving data.. What do we do ?
            // console.error('error while retrieving data from API');
        }
        this.answerCount++;
        if (this.answersTotal > 0 && this.answerCount === this.answersTotal) {
            // console.log('Count Answer - Total Reached, Update data', this.answerCount, this.answersTotal);
            this.setWpStorage(this.wpStorageTmp);
            this.initCountAnswers();
            return true;
        } else {
            return false;
        }
    }

    /**
     * GET ROUTES FROM API
     */

    /**
     * GET all test
     * ---------
     * @param req (Request)
     * @param res (Response)
     * @param next (NextFunction)
     */
    public getAll = (req: Request, res: Response, next: NextFunction) => {
        const lang =  req.query.lang ? req.query.lang : Config.defaultLang;
        // wpRouter.wpStorage[data].push('haha');
        // TODO: check if it should be sent as a string or JSON
        res.status(200).json({lang});
    }

    /**
     * GET Pages
     * ---------
     * @param req (Request)
     * @param res (Response)
     * @param next (NextFunction)
     */
    public getPages = (req: Request, res: Response, next: NextFunction): void => {
        const lang = req.query.lang ? req.query.lang : Config.defaultLang;

        const endpoint: string = 'pages';

        const resp: number = WordpressRouter.getData(this, lang, endpoint);
        switch (resp) {
            case 200:
                res.json(this.wpStorage[lang][endpoint]);
                break;
            case 503:
                res.status(503).send('Service Unavailable');
                break;
            default:
                res.status(503).send('Service Unavailable');
                break;
        }
    }

    /**
     * GET Posts
     * ---------
     * @param req (Request)
     * @param res (Response)
     * @param next (NextFunction)
     */
    public getPosts = (req: Request, res: Response, next: NextFunction): void => {
        const lang = req.query.lang ? req.query.lang : Config.defaultLang;

        const endpoint: string = 'posts';

        const resp: number = WordpressRouter.getData(this, lang, endpoint);
        // console.log('on ma appelé: ' + resp);
        switch (resp) {
            case 200:
                res.json(this.wpStorage[lang][endpoint]);
                break;
            case 503:
                res.status(503).send('Service Unavailable');
                break;
            default:
                res.status(503).send('Service Unavailable');
                break;
        }
    }
    /**
     * GET Categories
     * ---------
     * @param req (Request)
     * @param res (Response)
     * @param next (NextFunction)
     */
    // public getCategories = (req: Request, res: Response, next: NextFunction): void => {
    //     const lang = req.query.lang ? req.query.lang : Config.defaultLang;

    //     const endpoint: string = 'categories';

    //     const resp: number = WordpressRouter.getData(this, lang, endpoint);
    //     switch (resp) {
    //         case 200:
    //             res.json(this.wpStorage[lang][endpoint]);
    //             break;
    //         case 503:
    //             res.status(503).send('Service Unavailable');
    //             break;
    //         default:
    //             res.status(503).send('Service Unavailable');
    //             break;
    //     }
    // }

    /**
     * GET home_page
     * ---------
     * @param req (Request)
     * @param res (Response)
     * @param next (NextFunction)
     */
    public getHomePage = (req: Request, res: Response, next: NextFunction): void => {
        const lang = req.query.lang ? req.query.lang : Config.defaultLang;

        const endpoint: string = 'home_page';

        const resp: number = WordpressRouter.getData(this, lang, endpoint);
        switch (resp) {
            case 200:
                res.json(this.wpStorage[lang][endpoint]);
                break;
            case 503:
                res.status(503).send('Service Unavailable');
                break;
            default:
                res.status(503).send('Service Unavailable');
                break;
        }
    }
    /**
     * GET Pages
     * ---------
     * @param req (Request)
     * @param res (Response)
     * @param next (NextFunction)
     */
    public getCollections = (req: Request, res: Response, next: NextFunction): void => {
        const lang = req.query.lang ? req.query.lang : Config.defaultLang;

        const endpoint: string = 'collection_page';

        const resp: number = WordpressRouter.getData(this, lang, endpoint);
        switch (resp) {
            case 200:
                res.json(this.wpStorage[lang][endpoint]);
                break;
            case 503:
                res.status(503).send('Service Unavailable');
                break;
            default:
                res.status(503).send('Service Unavailable');
                break;
        }
    }

    /**
     * INITIALIZATIONS
     */

    public initLangEnpoints = (lang: string, endpoint: string) => {

        if (this.wpStorageTmp[lang] === undefined) {
            this.wpStorageTmp[lang] = {};
        }

        const promise = new Promise((resolve, reject) => {

            this.addCountAnswer();
            // const endpointPages = endpoint;
            const endpointPages = '/' + endpoint;

            if (this.wpStorageTmp[lang][endpoint] === undefined) {
                this.wpStorageTmp[lang][endpoint] = {};
            }
            const params = {lang, per_page: Config.wp_per_page};
            const paramsFormated: string = '?' + WordpressRouter.getParams(params);
            const callBack: (body: any) => void = (body) => {
                this.wpStorageTmp[lang][endpoint] = body;
            };

            // TODO: check where to mix url and endpoit
            requestAPI('GET', Config.wordpress.url + '/wp/v2', endpointPages, paramsFormated, callBack, this.addCountAnswer)
                .then((success) => {
                    this.checkCountAnswer(true);
                    resolve(success);
                }, (error) => {
                    this.checkCountAnswer(false);
                    reject(error);
                });
          });

        return promise;
    }

    public init = () => {
        let langCount: number = 0;
        const endpoints = Config.endpoints;
        // let endpoint;
        const resultsArray = {
            error: [],
            success: [],
        };
        this.initCountAnswers();
        this.initExpiration(Config.expiration);

        const promise = new Promise((resolve, reject) => {
            Config.langs.forEach((lang) => {
                    let endpointCount: number = 0;
                    endpoints.forEach((endpoint) => {
                    // endpoint = '/pages';
                        this.initLangEnpoints(lang, endpoint)
                            .then((result) => {
                                resultsArray.success.push(result);
                                endpointCount++;

                                // console.log(endpointCount, endpoints.length);

                                if (endpointCount === endpoints.length) {
                                    langCount++;
                                    if (langCount === Config.langs.length) {
                                        resolve(resultsArray);
                                    }
                                }
                            }, (error) => {
                                resultsArray.error.push(error);
                                endpointCount++;
                                // console.log(endpointCount, endpoints.length);
                                if (endpointCount === endpoints.length) {
                                    langCount++;
                                    if (langCount === Config.langs.length) {
                                        reject(resultsArray);
                                    }
                                }
                            });
                    });

                    // endpoint = '/posts';
                    // this.initLangEnpoints(lang, endpoint)
                    //     .then((result) => {
                    //         resultsArray.success.push(result);
                    //         endpointCount++;
                    //         // console.log(endpointCount, endpoints.length);
                    //         if (endpointCount === endpoints.length) {
                    //             langCount++;
                    //             if (langCount === Config.langs.length) {
                    //                 resolve(resultsArray);
                    //             }
                    //         }
                    //     }, (error) => {
                    //         resultsArray.error.push(error);
                    //         endpointCount++;
                    //         // console.log(endpointCount, endpoints.length);
                    //         if (endpointCount === endpoints.length) {
                    //             langCount++;
                    //             if (langCount === Config.langs.length) {
                    //                 reject(resultsArray);
                    //             }
                    //         }
                    //     });
                // });
                // TODO: what if the call isn't successful?
            });
        });
        return promise;
    }
}
