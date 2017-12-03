import assert from 'assert';
import mongoose from 'mongoose';

import User from '../src/models/User';

describe('User', () => {

    before((done) => {
        mongoose.connect('mongodb://localhost/testdb', { useMongoClient: true });
        const db = mongoose.connection;
        db.on('error', () => console.error('connection error'));
        db.once('open', () => {
            console.log('Connected to test database');
            done();
        });
    });

    it('should be invalid if login is empty', (done) => {
        let user = new User();
        user.save((error) => {
            assert.equal(error.errors['clientId'].message,
                'Path `clientId` is required.');
            error = user.validateSync();
            assert.equal(error.errors['clientId'].message,
                'Path `clientId` is required.');
            done();
        });
    });

    it('should be invalid if ticket is empty', (done) => {
        let user = new User({ clientId: '1' });
        user.save((error) => {
            assert.equal(error.errors['ticket'].message,
                'Path `ticket` is required.');
            error = user.validateSync();
            assert.equal(error.errors['ticket'].message,
                'Path `ticket` is required.');
            done();
        });
    });
});
