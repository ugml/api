import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../../src/App';

import * as ICoordinates from '../../src/interfaces/ICoordinates'

chai.use(chaiHttp);
const expect = chai.expect;

describe('authRoute', () => {

    it('should be json', () => {
        return chai.request(app).get('/v1/auth')
            .then(res => {
                expect(res.type).to.eql('application/json');
            });
    });

    it('should have a message prop', () => {
        return chai.request(app).get('/v1/')
            .then(res => {
                console.log(res.body.message);
                expect(res.body.message).to.eql('Hello World!');
            });
    });

});