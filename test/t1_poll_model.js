// set the env variable to test
process.env.NODE_ENV = 'test';

// imports
const assert = require('assert'),
      Poll = require('../models/poll'),
      mongoose = require('mongoose');

let newPoll;

describe('Poll Schema', () => {

    describe('Fields', () => {

        beforeEach((done) => {
            // create a valid poll to use in each test
            newPoll = new Poll({
                'user_id': new mongoose.Types.ObjectId,
                'title': 'Who is your favourite captain?',
                'options': [
                    { 
                        'option': 'Picard',
                        'votes': 2
                    }, {
                        'option': 'Kirk',
                        'votes': 3
                    }
                ],
                'voters': [
                    {
                        'ip': '192.95.20.138',
                        'user_id': new mongoose.Types.ObjectId
                    }
                ]
            });
            done();
        });

        describe('user_id:', () => {
            
            it('should be required', (done) => {
                newPoll.user_id = undefined;
                let error = newPoll.validateSync();
                assert.equal(error.errors['user_id'].message, 'user_id is a required field');
                done();
            });

            it('should accept a valid value', (done) => {
                newPoll.user_id = new mongoose.Types.ObjectId;
                let error = newPoll.validateSync();
                assert.equal(error, undefined);
                done();
            });

        });

        describe('title:', () => {

            it('should be required', (done) => {
                newPoll.title = '';
                let error = newPoll.validateSync();
                assert.equal(error.errors['title'].message, 'title is a required field');
                done();
            });

            it('should have a maximum length', (done) => {
                newPoll.title = '';
                while (newPoll.title.length < 105) {
                    newPoll.title += 'nnnn';
                }
                let error = newPoll.validateSync();
                assert.equal(error.errors['title'].message, 'title must be 100 characters or less');
                done();
            });

            it('should have a minimum length', (done) => {
                newPoll.title = 'not long enough';
                let error = newPoll.validateSync();
                assert.equal(error.errors['title'].message, 'title must be at least 20 characters long');
                done();
            });

            it('should accept a valid value', (done) => {
                newPoll.title = 'Who was the best captain?';
                let error = newPoll.validateSync();
                assert.equal(error, undefined);
                done();
            });

        });

        describe('options:', () => {

            describe('option:', () => {

                it('should be required', (done) => {
                    newPoll.options[0].option = undefined;
                    let error = newPoll.validateSync();
                    assert.equal(error.errors['options.0.option'].message, 'option is a required field');
                    done();
                });

                it('should have a maximum length', (done) => {
                    newPoll.options[0].option = '';
                    while (newPoll.options[0].option.length < 26) {
                        newPoll.options[0].option += 'nnnn';
                    }
                    let error = newPoll.validateSync();
                    assert.equal(error.errors['options.0.option'].message, 'option must be 25 characters or less');
                    done();
                });

                it('should accept a valid value', (done) => {
                    newPoll.options[0].option = 'Picard';
                    let error = newPoll.validateSync();
                    assert.equal(error, undefined);
                    done();
                });

            });

            describe('votes:', () => {

                it('should have a default value', (done) => {
                    newPoll.options[0].votes = undefined;
                    let error = newPoll.validateSync();
                    assert.equal(error, undefined);
                    done();
                });

                it('should accept a valid value', (done) => {
                    newPoll.options[0].votes = 5;
                    let error = newPoll.validateSync();
                    assert.equal(error, undefined);
                    done();
                });

            });

        });

        describe('voters:', () => {

            describe('ip:', () => {

                it('should be a valid ip address', (done) => {
                    newPoll.voters[0].ip = 'not an ip address';
                    let error = newPoll.validateSync();
                    assert.equal(error.errors['voters.0.ip'].name, 'ValidatorError');
                    done();
                });

                it('should accept a valid value', (done) => {
                    newPoll.voters[0].ip = '192.95.20.138';
                    let error = newPoll.validateSync();
                    assert.equal(error, undefined);
                    done();
                });

            });

            describe('user_id:', () => {

                it('should accept a valid value', (done) => {
                    newPoll.voters[0].user_id = new mongoose.Types.ObjectId;
                    let error = newPoll.validateSync();
                    assert.equal(error, undefined);
                    done();
                });

            });

        });

        describe('ts:', () => {

            it('should have a default value', (done) => {
                assert.ok(newPoll.ts);
                done();
            });

        });

    });

});