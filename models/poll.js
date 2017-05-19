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
            maxlength: [25, 'option must be 25 characters or less'],
            unique: true
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
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
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
    Poll.findById(id, callback);
};

module.exports.incrementVote = function(poll_id, option_id, voter_id, voter_ip, callback) {
    // update the vote count for the option selected
    const voterObj = {
        ip: voter_ip || '',
        id: voter_id || ''
    }    
    Poll.findByIdAndUpdate(
        {
            '_id': poll_id,
            'options._id': option_id
        },
        { 
            $set: { 
                $inc: { 'options.$.votes': 1  },
                $push: { 'voters': voterObj }
            }
        },
        callback
    );
}

module.exports.addOption = function(poll_id, option, callback) {
    // add the option and set votes to 1 for it
    const options = {
        runValidators: true
    }
    Poll.findByIdAndUpdate(poll_id, { $push: { options: option } }, options, callback);
}

module.exports.removeOption = function(poll_id, option_id, callback) {
    Poll.update( 
        { '_id': poll_id },
        { $pull: { 'options.option_id': option_id } },
        callback
    );
}

module.exports.addPoll = function(newPoll, callback) {
    newPoll.save(callback);
}