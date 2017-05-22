// set the env variable to test
process.env.NODE_ENV = 'test';

// require
const chai = require('chai'),
      expect = chai.expect,
      request = require('superagent'),
      config = require('config'),
      mongoose = require('mongoose'),
      server = require('../server'),
      Poll = require('../models/poll'),
      assert = require('assert'),
      url = 'localhost:8080/';

let newPoll;
let pollId;

describe('Poll API', () => {

    before((done) => {
        // empty the test database 'polls' collection
        Poll.remove({}, (err) => {
            assert.ifError(err);
            done();
        });
        newPoll = new Poll({});
    });

    describe('adds a poll to the collection', () => {

        // it('does not not add a poll with invalid information', (done) => {
        //     request
        //         .post(url + 'api/polls/new')
        //         .send(newPoll)
        //         .set('Content-Type', 'application/json')
        //         .end((err, res) => {
        //             expect(res.body.success).to.equal(false);
        //             expect(res.body.msg).to.equal('Failed to create poll');
        //             done();
        //         });
        //     done();
        // });

        // it('adds a poll with valid information', (done) => {
        //     newPoll.user_id = new mongoose.Types.ObjectId();
        //     newPoll.username = 'willsmith';
        //     newPoll.title = 'Who is your fave rapper?';
        //     newPoll.options = [
        //         { option: 'JayZ' },
        //         { option: 'Will Smith' }
        //     ];
        //     request
        //         .post(url + 'api/polls/new')
        //         .send(newPoll)
        //         .set('Content-Type', 'application/json')
        //         .end((err, res) => {
        //             expect(res.body.success).to.equal(true);
        //             expect(res.body.msg).to.equal('Poll created');
        //             done();
        //         });
        //     done();
        // });

    });

    describe('poll manipulation:', () => {

        // before((done) => {
        //     pollId = new mongoose.Types.ObjectId();
        //     newPoll.user_id = pollId;
        //     newPoll.username = 'willsmith';
        //     newPoll.title = 'Who is your fave rapper?';
        //     newPoll.options = [
        //         { option: 'JayZ' },
        //         { option: 'Will Smith' }
        //     ];
        //     request
        //         .post(url + 'api/polls/new')
        //         .send(newPoll)
        //         .set('Content-Type', 'application/json')
        //         .end((err, res) => {
        //             assert.ifError(err);
        //             done();
        //         });
        // });

        // it('adds an option to a poll', (done) => {

        //     done();
        // });

        // it('removes an option from a poll', (done) => {

        //     done();
        // });

        // it('increments votes and records voter ip', (done) => {

        //     done();            
        // });

        // it('deletes a poll from the collection', (done) => {
            
        //     done();
        // });

    });       

});