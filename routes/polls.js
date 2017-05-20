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
            res.json({ success: false, msg: 'poll not found' });
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
    Poll.addPoll(newPoll, (err) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to create poll', errmsg: err.message });
        } else {
            res.json({ success: true, msg: 'Poll created' });
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
        console.log('doc:', doc);
        if (err) {
            res.json({ success: false, msg: 'Failed to remove option', errmsg: err.message });
        } else if (doc) {
            res.json({ success: true, msg: 'Option removed' });
        } else {
            res.json({ success: false, msg: 'Failed to remove option' });
        }
    });
});

// export router
module.exports = router;