export default interface IConfig {
    base: any;
    defaultLang: string;
    endpoints: Array<string>;
    environment: string;
    expiration: number;
    langs: Array<string>;
    wordpress: any;
    wp_per_page: number;
}
