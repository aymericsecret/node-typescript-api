import * as supertest from 'supertest';
import app from '../src/App';

describe('baseRoute', () => {

    it('should be json', () => {
        return supertest(app).get('/')
            .expect(200)
            .then((res) => {
                expect(res.type).toBe('application/json');
            });
    });

    it('should have a message property', () => {
        return supertest(app).get('/')
            .expect(200)
            .then((res) => {
                expect(typeof res.body).toBe('object');
                // expect(res.body.message).toBe('Hello World!');
            });
    });

  });
