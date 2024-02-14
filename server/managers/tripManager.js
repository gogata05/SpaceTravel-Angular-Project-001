const Trip = require('../models/Trip');


exports.getAll = async (page, itemsPerPage) => {
    return await Trip.find({}).skip(page * itemsPerPage).limit(itemsPerPage).populate('_ownerId');
}

// exports.getSearchResult = async (searchInput, page, itemsPerPage) => {
//     const regex = new RegExp(searchInput, 'i');
//     return  await Trip.find({name: {$regex: regex}}).skip(page * itemsPerPage).limit(itemsPerPage).populate('_ownerId');
// }//change name to startLocation/endLocation

exports.getSearchResult = async (searchInput, page, itemsPerPage) => {
    const regex = new RegExp(searchInput, 'i');
    return await Trip.find({
        $or: [
            {startLocation: {$regex: regex}},
            {endLocation: {$regex: regex}}
        ]
    }).skip(page * itemsPerPage).limit(itemsPerPage).populate('_ownerId');
};

exports.getRecent = () => {
    return Trip.find({}).sort({ _id: -1 }).limit(3).populate('_ownerId');
}


exports.getByUserId = async (userId, page, itemsPerPage) => {
    const userTrips = await Trip.find({ _ownerId: userId }).skip(page * itemsPerPage).limit(itemsPerPage).populate('_ownerId');
    const count = await Trip.countDocuments({_ownerId: userId});
    let pageCount = 0;
        if (count % itemsPerPage === 0) {
            pageCount = count / itemsPerPage;
        } else {
            pageCount = Math.floor(count / itemsPerPage) + 1;
        }
        return { userTrips: userTrips, pageCount };
}

exports.getById = async (id) => {
    const trip = Trip.findById(id).populate('_ownerId').populate('commentList.user');
    return trip;
}

exports.create = async (item) => {
    return Trip.create(item);
}

exports.update = async (id, item) => {
    const existing = await Trip.findById(id);

    existing.startLocation = item.startLocation;//!
    existing.endLocation = item.endLocation;//!
    existing.startDate = item.startDate;//!
    existing.endDate = item.endDate;//!
    existing.description = item.description;
    existing.img = item.img;

    return existing.save();
}

exports.deleteById = async (id) => {
    return Trip.findByIdAndDelete(id);
}

exports.getCount = async () => {
    return Trip.countDocuments({});
};

// exports.getSearchCount = async (searchParam) => {
//     const regex = new RegExp(searchParam, 'i');
//     return Trip.countDocuments({name: {$regex: regex}});
// };//change name to startLocation/endLocation

exports.getSearchCount = async (searchParam) => {
    const regex = new RegExp(searchParam, 'i');
    return Trip.countDocuments({
        $or: [
            {startLocation: {$regex: regex}},
            {endLocation: {$regex: regex}}
        ]
    });
};


exports.addComment = async (id, commentData) => {
    const trip = await Trip.findById(id).populate('_ownerId').populate('commentList.user');
    trip.commentList.push(commentData);
    trip.save();
    return trip;
}

exports.addLike = async (id, userId) => {
    const trip = await Trip.findById(id).populate('_ownerId').populate('commentList.user');
    trip.likes.push(userId);
    trip.save();
    return trip;
}

exports.downloadImage = async (id, userId) => {
    const trip = await Trip.findById(id).populate('_ownerId').populate('commentList.user');
    trip.downloads.push(userId);
    trip.save();
    return trip;
}