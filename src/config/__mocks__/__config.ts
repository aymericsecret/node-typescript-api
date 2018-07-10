import IConfig from '../configInterface';
// var config = require('./config.js').get(process.env.NODE_ENV);

export default function(): IConfig {
    switch (process.env.NODE_ENV) {
        default:
            return {
                defaultLang: 'en',
                environment: 'default',
                expiration: (1 / 2) * 60 * 60 * 1000,
                langs: [],
                wordpress: {
                    url: 'http://www.clubebossa.com/backend/wp-json',
                },
                wp_per_page: 60,
            };
    }
}
