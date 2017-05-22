const express = require('express'),
      router = express.Router(),
      Poll = require('../models/poll'),
      config = require('config'),
      jwt = require('jsonwebtoken'),
      passport = require('passport');

// retrieve a poll
router.get('/:id', (req, res) => {
    Poll.getPollById(req.params.id, (err, poll) => {
        if (err) {
            return res.json({ success: false, msg: err.message });
        }
        if (poll) {
            res.json({ sucess: true, poll });
        } else {
            res.json({ success: false, msg: 'Poll not found' });
        }
    });
});

// retrieve all polls
router.get('/', (req, res) => {
    Poll.getPolls((err, docs) => {
        if (err) {
            return res.json({ success: false, msg: err.message });
        } else {
            res.json({ success: true, polls: docs });
        }
    });
});

// add a poll to the database
router.post('/new', passport.authenticate('jwt', {session: false}), (req, res) => {
    const newPoll = new Poll({
        user_id: req.user._id,
        username: req.user.username,
        title: req.body.title,
        options: req.body.options
    });
    Poll.addPoll(newPoll, (err, doc) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to create poll', errmsg: err.message });
        } else if (doc) {
            res.json({ success: true, msg: 'Poll created' });
        } else {
            res.json({ success: false, mag: 'Failed to create poll' });
        }
    });
});

// add an option to the poll
router.put('/:id/addoption', passport.authenticate('jwt', {session: false}), (req, res) => {
    const poll_id = req.params.id;
    const option = req.body.option;
    Poll.addOption(poll_id, option, (err) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to add option', errmsg: err.message });
        } else {
            res.json({ success: true, msg: 'Option added' });
        }
    });

});

// remove an option from the poll
router.put('/:id/removeoption', passport.authenticate('jwt', {session: false}), (req, res) => {
    const poll_id = req.params.id;
    const option = req.body.option;
    Poll.removeOption(poll_id, option, (err, doc) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to remove option', errmsg: err.message });
        } else if (doc) {
            res.json({ success: true, msg: 'Option removed' });
        } else {
            res.json({ success: false, msg: 'Failed to remove option' });
        }
    });
});

// remove a poll from the database
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const poll_id = req.params.id;
    Poll.removePoll(poll_id, (err, doc) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to delete poll', errmsg: err.message });
        } else {
            res.json({ success: true, msg: 'Poll deleted' });
        }
    });
});

// increment the number of votes and log voter ip
router.put('/:id/vote', (req, res) => {
    const poll_id = req.params.id;
    const option_id = req.body.option_id;
    const voter_ip = req.body.voter_ip;
    Poll.hasAlreadyVoted(poll_id, voter_ip, (err, doc) => {
        if (err) {
            res.json({ success: false, msg: 'An error has occurred', errmsg: err.message });
        } else if (doc) {
            res.json({ success: false, msg: 'IP has already voted for this poll' });
        } else {
            Poll.incrementVote(poll_id, option_id, voter_ip, (err, doc) => {
                if (err) {
                    res.json({ success: false, msg: 'Failed to record vote', errmsg: err.message });
                } else if (doc) {
                    res.json({ success: true, msg: 'Vote recorded' });
                } else {
                    res.json({ success: false, msg: 'Did not record vote' });
                }
            });
        }
    });
});

// export router
module.exports = router;