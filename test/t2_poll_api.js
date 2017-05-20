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

describe('Poll API', () => {

    before((done) => {
        // empty the test database 'polls' collection
        Poll.remove({}, (err) => {
            assert.ifError(err);
        });
        done();
    });

    describe('adds a poll to the collection', () => {

        it('does not not add a poll with invalid information', (done) => {

            done();
        });

        it('adds a poll with valid information', (done) => {

            done();
        });

    });

    describe('adds an option to a poll', () => {



    });

    describe('removes an option from a poll', () => {



    });

    describe('increments votes and records voter ip/id', () => {


        
    });

});