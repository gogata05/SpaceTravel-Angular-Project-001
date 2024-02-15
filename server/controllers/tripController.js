const fs = require('fs');
const path = require('path');
const moment = require('moment');


const tripController = require('express').Router();

const tripManager = require('../managers/tripManager')
const { isAuth, auth } = require('../middlewares/authMiddleware')
const { parseError } = require('../util/parser');
const itemsPerPage = 6;


tripController.get('/count', async (req, res) => {
    try {
        const count = await tripManager.getCount();
        let pageCount = 0;
        if (count % itemsPerPage === 0) {
            pageCount = count / itemsPerPage;
        } else {
            pageCount = Math.floor(count / itemsPerPage) + 1;
        }
        res.json(pageCount);
    } catch (err) {
        const message = parseError(err);
        console.log(message);
        res.status(400).json({ message });
    }
});


tripController.get('/recent', async (req, res) => {
    const trips = await tripManager.getRecent();
    res.json(trips);
});


tripController.get('/search', async (req, res) => {
    try {
        const searchParam = req.query.searchParam;
        const count = await tripManager.getSearchCount(searchParam);
        let pageCount = 0;
        if (count % itemsPerPage === 0) {
            pageCount = count / itemsPerPage;
        } else {
            pageCount = Math.floor(count / itemsPerPage) + 1;
        }
        res.json(pageCount);
    } catch (err) {
        const message = parseError(err);
        console.log(message);
        res.status(400).json({ message });
    }
});


tripController.post('/search', async (req, res) => {
    try {
        const page = req.body.page - 1 || 0;
        const searchParam = req.body.searchParam;
        const trips = await tripManager.getSearchResult(searchParam, page, itemsPerPage);
        res.json(trips);

    } catch (err) {
        const message = parseError(err);
        console.log(message);
        res.status(400).json({ message });
    }
});


tripController.get('/', async (req, res) => {
    let items = [];
    const page = req.query.page - 1 || 0;

    try {
        if (req.query.where) {
            const userId = JSON.parse(req.query.where.split('=')[1]);
            items = await tripManager.getByUserId(userId, page, itemsPerPage);
        } else {
            items = await tripManager.getAll(page, itemsPerPage);
        }
        res.json(items);
    } catch (err) {
        const message = parseError(err);
        console.log(message);
        res.status(400).json({ message });
    }

});

//TODO: Turn on Guards and add userId...
tripController.post('/', async (req, res) => {

    try {

        const data = {
            "startLocation": req.body.startLocation,//!
            "endLocation": req.body.endLocation,//!
            "startDate": req.body.startDate,//!
            "endDate": req.body.endDate,//!
            "description": req.body.description,
            "img": {
                "data": fs.readFileSync("uploads/" + req.file.filename),
                "contentType": "image/png",
            },
            "_ownerId": req.user._id
        };


        const newTrip = await tripManager.create(data);
        console.log('Created!');
        res.json(newTrip);


        //const data = Object.assign({ _ownerId: req.user._id }, req.body);
        //const data = Object.assign(req.body);
        //const item = await tripManager.create(data);
        //res.json(item);
    } catch (err) {
        const message = parseError(err);
        console.log(message);
        res.status(400).json({ message });
    }
});

tripController.get('/:id', async (req, res) => {
    const trip = await tripManager.getById(req.params.id);
    res.json(trip);
});

tripController.put('/:id', isAuth, async (req, res, next) => {
    const item = await tripManager.getById(req.params.id);
    //console.log('req.user', req.user._id);
    //console.log('item._ownerId', item._ownerId._id.toString());
    if (req.user._id != item._ownerId._id.toString()) {
        return res.status(403).json({ message: 'You cannot modify this record' });
    }

    try {

        const data = {
            "startLocation": req.body.startLocation,//!
            "endLocation": req.body.endLocation,//!
            "startDate": req.body.startDate,//!
            "endDate": req.body.endDate,//!
            "description": req.body.description,
            "img": {
                "data": fs.readFileSync("uploads/" + req.file.filename),
                "contentType": "image/png",
            },
            "_ownerId": req.user._id
        };

        const updatedTrip = await tripManager.update(req.params.id, data);
        console.log('updated!');
        res.json(updatedTrip);

    } catch (err) {
        const message = parseError(err);
        console.log(message);
        res.status(400).json({ message });
    }
});

tripController.delete('/:id', isAuth, async (req, res) => {
    const item = await tripManager.getById(req.params.id);
    if (req.user._id != item._ownerId._id.toString()) {
        return res.status(403).json({ message: 'You cannot modify this record' });
    }

    try {
        await tripManager.deleteById(req.params.id);
        res.status(204).end();
    } catch (err) {
        const message = parseError(err);
        console.log(message);
        res.status(400).json({ message });
    }
});


//COMMENT==================================================================
tripController.post('/:id/comments', isAuth, async (req, res) => {
    const tripId = req.params.id;
    const { comment } = req.body;
    const user = req.user._id;
    try {
        const result = await tripManager.addComment(tripId, { comment, user });
        res.json(result);
    } catch (err) {
        const message = parseError(err);
        console.log(message);
        res.status(400).json({ message });
    }
});


//LIKES==================================================================
tripController.get('/:id/likes', isAuth, async (req, res) => {
    const tripId = req.params.id;
    const userId = req.user._id;
    try {
        const trip = await tripManager.getById(tripId);
        const isLiked = trip.likes.map(x => x._id.toString()).includes(req.user?._id.toString());
        if (isLiked) {
            return res.status(400).json({ message: 'You have already liked this trip!' });
        }

        const result = await tripManager.addLike(tripId, userId);
        res.json(result);
    } catch (err) {
        const message = parseError(err);
        console.log(message);
        res.status(400).json({ message });
    }
});


//DOWNLOAD==================================================================
tripController.get('/:id/downloads', isAuth, async (req, res) => {
    const tripId = req.params.id;
    const userId = req.user._id;
    try {
        const trip = await tripManager.getById(tripId);
        const result = await tripManager.downloadImage(tripId, userId);
        res.json(result);
    } catch (err) {
        const message = parseError(err);
        console.log(message);
        res.status(400).json({ message });
    }
});


module.exports = tripController;