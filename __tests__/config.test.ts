import config from '../src/config/config';

const OLD_ENV = process.env;

beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    delete process.env.NODE_ENV;
});

afterEach(() => {
    process.env = OLD_ENV;
});

describe('configuration file', () => {

    it('should give localhost in development environment', () => {
        process.env.NODE_ENV = 'development';
        const Config = config();
        expect(Config.environment).toBe('development');
    });
    it('should give production api in production environment', () => {
        process.env.NODE_ENV = 'production';
        const Config = config();
        expect(Config.environment).toBe('production');
    });
    it('should give production api in staging environment', () => {
        process.env.NODE_ENV = 'staging';
        const Config = config();
        expect(Config.environment).toBe('staging');
    });
    it('should give production api in default', () => {
        process.env.NODE_ENV = '';
        const Config = config();
        expect(Config.environment).toBe('default');
    });

});
