import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../App';

chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request(app);

describe('authRoute', () => {

    // TODO properly initialize and tear down app with db connections to be able to remove mocha --exit flag!

    it('should be json', async () => {
        return request.get('/v1/auth')
            .then(res => {
                expect(res.type).to.eql('application/json');
            });
    });

    it.skip('should have a message prop', () => {
        return request.get('/v1/')
            .then(res => {
                console.log(res.body.message);
                expect(res.body.message).to.eql('Hello World!');
            });
    });

});