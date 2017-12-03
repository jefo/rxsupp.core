import assert from 'assert';
import mongoose from 'mongoose';

import Support from '../src/models/Support';

describe('Support', () => {

    before((done) => {
        mongoose.connect('mongodb://localhost/testdb', { useMongoClient: true });
        const db = mongoose.connection;
        db.on('error', () => console.error('connection error'));
        db.once('open', () => {
            console.log('Connected to test database');
            done();
        });
    });

    it('should be invalid if email is empty', (done) => {
        let user = new Support();
        user.save((error) => {
            assert.equal(error.errors['email'].message,
                'Path `email` is required.');
            error = user.validateSync();
            assert.equal(error.errors['email'].message,
                'Path `email` is required.');
            done();
        });
    });

    it('should be invalid if password is empty', (done) => {
        let user = new Support({ email: 'joe' });
        user.save((error) => {
            assert.equal(error.errors['password'].message,
                'Path `password` is required.');
            error = user.validateSync();
            assert.equal(error.errors['password'].message,
                'Path `password` is required.');
            done();
        });
    });
});
