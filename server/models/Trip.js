const mongoose = require('mongoose');
const SpaceLocation = {
    Earth: 'Earth',
    Mars: 'Mars',
    Venus: 'Venus',
    Jupiter: 'Jupiter',
    Saturn: 'Saturn',
    Uranus: 'Uranus',
    Neptune: 'Neptune',
    Pluto: 'Pluto',
    Moon: 'Moon',
    Mercury: 'Mercury',
    Titan: 'Titan', 
    Europa: 'Europa', 
    Ganymede: 'Ganymede', 
    Callisto: 'Callisto',
    Io: 'Io', 
    Ceres: 'Ceres', 
    Eris: 'Eris', 
    Haumea: 'Haumea', 
    Makemake: 'Makemake',
};
const TripSchema = new mongoose.Schema({
    startLocation: {
        type: String,
        enum: Object.values(SpaceLocation),
        required: [true, 'Start location is required!'],
    },
    endLocation: {
        type: String,
        enum: Object.values(SpaceLocation),
        required: [true, 'End location is required!'],
    },
    
    startDate: {
        type: Date,
        required: [true, 'Start date is required!'],
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required!'],
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minlength: [10, 'Description must be at least 10 characters long'],
        maxLength: [50, 'The description should not be more than 50 characters long!'],
    },
    img: {
        data: {
            type: Buffer,
            contentType: String,
        },
    
    },

    _ownerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    commentList: [{
        user: {
            type: mongoose.Types.ObjectId,
            required: [true, 'Name is required'],
            ref: 'User'
        },
        comment: {
            type: String,
            required: [true, 'Comment message is required']
        }
    }],
    likes: [{
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    }],
    downloads: [{
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    }]

});

const Trip = mongoose.model('Trip', TripSchema);
module.exports = Trip;