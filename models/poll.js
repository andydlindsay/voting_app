const mongoose = require('mongoose');

// voters.ip regex from ErickBest's answer on stackoverflow
// http://stackoverflow.com/questions/4460586/javascript-regular-expression-to-check-for-ip-addresses

// Poll schema
const pollSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user_id is a required field']
    },
    username: {
        type: String,
        minlength: [8, 'username must be at least 8 characters long'],
        maxlength: [25, 'username must be less than 25 characters long'],
        match: /^[a-zA-Z0-9]+$/
    },
    title: {
        type: String,
        required: [true, 'title is a required field'],
        maxlength: [100, 'title must be 100 characters or less'],
        minlength: [20, 'title must be at least 20 characters long'],
        unique: true
    },
    options: [{
        option: {
            type: String,
            required: [true, 'option is a required field'],
            maxlength: [25, 'option must be 25 characters or less']
        },
        votes: {
            type: Number,
            default: 0
        }
    }],
    voters: [{
        ip: {
            type: String,
            match: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        }
    }],
    ts: {
        type: Date,
        default: Date.now
    }
});

// export Poll
const Poll = module.exports = mongoose.model("Poll", pollSchema, "polls");

module.exports.getPollById = function(id, callback) {
    Poll.findById(id, { username: 1, title: 1, options: 1, ts: 1 }, callback);
};

module.exports.removePoll = function(id, callback) {
    Poll.findByIdAndRemove(id, callback);
};

module.exports.getPolls = function(callback) {
    Poll.find({}, { username: 1, title: 1, options: 1, ts: 1 }, callback);
}

module.exports.incrementVote = function(poll_id, option_id, voter_ip, callback) {
    // update the vote count for the option selected
    const voterObj = {
        ip: voter_ip
    }    
    Poll.findOneAndUpdate(
        {
            '_id': poll_id,
            'options._id': option_id
        },
        { 
            $inc: { 'options.$.votes': 1  },
            $push: { voters: voterObj }
        },
        callback
    );
}

module.exports.addOption = function(poll_id, option, callback) {
    const myOptions = {
        runValidators: true
    }
    Poll.findOneAndUpdate(
        { _id: poll_id},
        { $push: { options: option } },
        myOptions,
        callback
    );
}

module.exports.removeOption = function(poll_id, option, callback) {
    Poll.findOneAndUpdate( 
        { _id: poll_id },
        { $pull: { options: option } },
        callback
    );
}

module.exports.addPoll = function(newPoll, callback) {
    const options = {
        runValidators: true
    }
    newPoll.save(options, callback);
}

module.exports.hasAlreadyVoted = function(poll_id, voter_ip, callback) {
    Poll.findOne({ 
        _id: poll_id,
        'voters.ip': voter_ip
    }, callback);
}