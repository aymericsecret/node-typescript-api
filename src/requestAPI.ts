import * as request from 'request';
import config from './config/config';
const Config = config();

export function requestAPI(method: string, uri: string,  endpoint: string,  params: string, callBack?: (body: any) => void, init?: () => any): Promise<any> {
  return new Promise((resolve, reject) => {
    // TODO: check where to mix url and endpoit
    uri =  uri + endpoint + params;

    // This is an http request, to fetch informaition from the Wordpress API.
    // This module is being mocked in __mocks__/requestAPI.js
    request({method, uri}, (error, response, body) => {
      // console.log(body);
      if (error) {
          // console.log('getPageFromAPI error', error);
          reject(JSON.parse(error));
          // reject(error);
      } else {
          // console.log('all done', params);
          if (callBack !== undefined) {
            callBack(JSON.parse(body));
            // callBack(body);
          }
          resolve(JSON.parse(body));
          // resolve(body);
      }
    });
  });
}

// /**
//  * getPageFromAPI
//  * @param endpoint - Ex: /posts
//  * @param store - Name of page for local storage
//  * @param params - Query parameters (ex: {'slug': 'my-slug'})
//  * @return Promise with either error, or endpoint response
//  */
// export function getPageFromAPI(endpoint: string, lang: string, store: string, type: string, params: any, init?: () => void, callBack?: () => void) {
//   // updates the total number of answers we should retrieve before updating the set of data to send back to the api calls
//   // this.addCountAnswer();
//   console.log('hello');

//   init();

//   const method = 'GET';
//   const uri = Config.wordpress.url + '/wp/v2';

//   return requestAPI(method, uri, endpoint, params, callBack);

//   // switch (endpoint) {
//   //     case '/pages':
//   //         return requestPages(uri, paramsFormated, callBack);
//   //     default:
//   // return requestAPI(method, uri, endpoint, paramsFormated, callBack);
//   // }
// }

// export function requestPages(uri: string, params: string, callBack?: (body: any) => void): Promise<any> {
//   const endpoint = '/pages';
//   return new Promise((resolve, reject) => {
//     // This is an http request, to fetch informaition from the Wordpress API.
//     // This module is being mocked in __mocks__/request.js
//     request({method: 'GET', uri}, (error, response, body) => {
//       console.log(body);
//       if (error) {
//           // console.log('getPageFromAPI error', error);
//           reject(error);
//       } else {
//           // console.log('all done', params);
//           if (typeof callBack === 'function') {
//             callBack(JSON.parse(body));
//           }
//           resolve(JSON.parse(body));
//       }
//     });
//   });
// }
