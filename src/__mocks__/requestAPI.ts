// __mocks__/requestAPI.ts
// import * as fs from 'file-system';
import * as fs from 'fs';

export function requestAPI(method: string, uri: string, endpoint: string,  params: string, callBack?: (body: any) => void): Promise<any> {
    return new Promise((resolve, reject) => {

        process.nextTick(
        () => {
            // console.log('all done', params);
            switch (endpoint) {
                case '/nocallback':
                    resolve({method, uri, endpoint, params, callBack});
                    break;
                case '/fail':
                    reject({method, uri, endpoint, params, callBack});
                    break;
                case '/pages':
                    let pageFile;
                    if (params.indexOf('en') >= 0) {
                        pageFile = 'pages-en.json';
                    } else if (params.indexOf('pt-br') >= 0) {
                        pageFile = 'pages-pt.json';
                    } else {
                        pageFile = 'pages-en.json';
                    }
                    fs.readFile('./__mockData__/' + pageFile, 'utf8', (err, data) => {
                        // console.log(JSON.parse(data)[0].id);
                        if (err) reject(err);
                        // Parse the data as JSON and put in the key entity (just like the request library does)
                        // resolve({ entity: JSON.parse(data) })
                        callBack(JSON.parse(data));
                        resolve(JSON.parse(data));
                      });
                    break;
                    // TODO: change mock file for posts, collections and home page!
                case '/posts':
                    let postFile;
                    if (params.indexOf('en') >= 0) {
                        postFile = 'pages-en.json';
                    } else if (params.indexOf('pt-br') >= 0) {
                        postFile = 'pages-pt.json';
                    }
                    fs.readFile('./__mockData__/' + postFile, 'utf8', (err, data) => {
                        // console.log(JSON.parse(data)[0].id);
                        if (err) reject(err);
                        // Parse the data as JSON and put in the key entity (just like the request library does)
                        // resolve({ entity: JSON.parse(data) })
                        callBack(JSON.parse(data));
                        resolve(JSON.parse(data));
                      });
                    break;
                case '/collection_page':
                    let collectionFile;
                    if (params.indexOf('en') >= 0) {
                        collectionFile = 'pages-en.json';
                    } else if (params.indexOf('pt-br') >= 0) {
                        collectionFile = 'pages-pt.json';
                    }
                    fs.readFile('./__mockData__/' + collectionFile, 'utf8', (err, data) => {
                        // console.log(JSON.parse(data)[0].id);
                        if (err) reject(err);
                        // Parse the data as JSON and put in the key entity (just like the request library does)
                        // resolve({ entity: JSON.parse(data) })
                        callBack(JSON.parse(data));
                        resolve(JSON.parse(data));
                      });
                    break;
                case '/home_page':
                    let homepageFile;
                    if (params.indexOf('en') >= 0) {
                        homepageFile = 'pages-en.json';
                    } else if (params.indexOf('pt-br') >= 0) {
                        homepageFile = 'pages-pt.json';
                    }
                    fs.readFile('./__mockData__/' + homepageFile, 'utf8', (err, data) => {
                        // console.log(JSON.parse(data)[0].id);
                        if (err) reject(err);
                        // Parse the data as JSON and put in the key entity (just like the request library does)
                        // resolve({ entity: JSON.parse(data) })
                        callBack(JSON.parse(data));
                        resolve(JSON.parse(data));
                      });
                    break;
                default:
                    callBack('callback called');
                    resolve({method, uri, endpoint, params, callBack});
                    break;

            }

            // if (endpoint !== '/nocallback') {
            //     if (typeof callBack === 'function') {
            //       callBack('callback called');
            //     }
            // }
            // if (endpoint === '/fail') {
            //     reject({method, uri, endpoint, params, callBack});
            // } else {
            //     resolve({method, uri, endpoint, params, callBack});
            // }
        },
            // users[userID]
            // ? resolve({post_title: 'pages'});
            // : reject({
            //     error: 'Page not found',
            //     }),
        );
    });
}

// export function getPageFromAPI(endpoint: string, lang: string, store: string, type: string, params: any, init?: () => void, callBack?: () => void) {
//     // updates the total number of answers we should retrieve before updating the set of data to send back to the api calls
//     // this.addCountAnswer();
//     init();

//     const method = 'GET';
//     const uri = this.WP_URL + '/wp/v2';

//     return requestAPI(method, uri, endpoint, params, callBack);
// }
