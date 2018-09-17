import IConfig from './configInterface';
// var config = require('./config.js').get(process.env.NODE_ENV);

export default function(): IConfig {
    const sec = 1000;
    const min = 60;
    const hour = 60;
    switch (process.env.NODE_ENV) {
        case 'development':
            return {
                base: {
                    wordpress: '/clubebossa/wp',
                },
                defaultLang: 'en',
                endpoints: ['pages', 'posts', 'home_page', 'collection_page'],
                environment: 'development',
                expiration: (1 / 2) * 60 * 60 * 1000,
                langs: ['en', 'pt-br'],
                wordpress: {
                    // url: 'http://localhost/clubebossa-wc/wp-json',
                    url: 'http://shop.clubebossa.com/wp-json',
                    // url: 'https://test.regularswitch.com/clubebossa-frontend/site/backend/wp-json',
                    // url: 'http://www.clubebossa.com/backend/wp-json',
                },
                wp_per_page: 60,
            };
        case 'staging':
            return {
                base: {
                    wordpress: '/clubebossa/wp',
                },
                defaultLang: 'en',
                endpoints: ['pages', 'posts', 'home_page', 'collection_page'],
                environment: 'staging',
                expiration: (1 / 2) * 60 * 60 * 1000,
                langs: ['en', 'pt-br'],
                wordpress: {
                    // url: 'https://test.regularswitch.com/clubebossa-frontend/site/backend/wp-json',
                    url: 'http://shop.clubebossa.com/wp-json',
                    // url: 'http://localhost/clubebossa-wc/wp-json',
                },
                wp_per_page: 60,
            };
        case 'production':
            return {
                base: {
                    wordpress: '/clubebossa/wp',
                },
                defaultLang: 'en',
                endpoints: ['pages', 'posts', 'home_page', 'collection_page'],
                environment: 'production',
                expiration: (1 / 2) * 60 * 60 * 1000,
                langs: ['en', 'pt-br'],
                wordpress: {
                    // url: 'http://www.clubebossa.com/backend/wp-json',
                    url: 'http://shop.clubebossa.com/wp-json',
                    // url: 'http://localhost/clubebossa-wc/wp-json',
                },
                wp_per_page: 60,
            };
        default:
            return {
                base: {
                    wordpress: '/clubebossa/wp',
                },
                defaultLang: 'en',
                endpoints: ['pages', 'posts', 'home_page', 'collection_page'],
                environment: 'default',
                expiration: 1 * min * sec,
                // expiration: (2 / 2) * 60 * 60 * 1000,
                langs: ['en', 'pt-br'],
                wordpress: {
                    // url: 'http://www.clubebossa.com/backend/wp-json',
                    url: 'http://shop.clubebossa.com/wp-json',
                    // url: 'http://localhost/clubebossa-wc/wp-json',
                },
                wp_per_page: 60,
            };
    }
}
