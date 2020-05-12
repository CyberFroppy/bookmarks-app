const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const keyHandling = require('./middleware/keyHandling');
const { BookmarkCrud } = require('./models/model');
const mongoose = require('mongoose');
const { DATABASE_URL, PORT } = require("./config");
const api = express();
const jsonParser = bodyParser.json();

api.use(express.static("public"));
api.use(morgan('dev'));
api.use(keyHandling);

//Bookmarks for testing
let books = [createBookmark("The Outsiders", "Ponyboy and Soda Pop are brothers and try to rescue their mother", "https://www.amazon.com/Outsiders-S-Hinton-ebook/dp/B007ZUV4TO/ref=sr_1_2?dchild=1&keywords=the+outsiders&qid=1587766593&sr=8-2", 4),
createBookmark("Moby Dick", "White Whale Hunt", "https://www.amazon.com/Moby-Dick-Herman-Melville/dp/B086PNWPJ2/ref=sr_1_1_sspa?crid=3I6UHOB2B3EKI&dchild=1&keywords=moby+dick&qid=1587766616&sprefix=moby+dick%2Caps%2C173&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyWDdOUjBPMUNDWktSJmVuY3J5cHRlZElkPUEwODU2OTYxMUhYTTJHMVpZVklNSCZlbmNyeXB0ZWRBZElkPUEwODA1NDk3Mk5TS05DTFpaTVVYUCZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=", 5),
createBookmark("The Outsider", "A juicy tale that plays at the forefront of our current phobias...", "https://www.amazon.com/dp/B078M5G7XH/ref=s9_acsd_simh_bw_c2_x_1_i?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-5&pf_rd_r=XE3WH3SABYK8Q31NJPTM&pf_rd_t=101&pf_rd_p=0c29b3fe-5d53-4fe7-9be0-fd011a7d613d&pf_rd_i=283155", 4)];

//Bookmarks format
function createBookmark(title, description, url, rating) {
    const id = uuid.v4();
    const bookmark = {
        id: id,
        title: title,
        description: description,
        url: url,
        rating: rating
    }
    return bookmark;
}
// Get Endpoint to get all Bookmarks
api.get('/bookmarks', (req, res) => {
    BookmarkCrud.allBookmarks()
        .then(books => res.status(200).json(books))
        .catch(err => {
            console.log(err)
            res.statusMessage = "Something went wrong with the DB. Try again later";
            return res.status(500).end();
        });
});

// Get Endpoint by Title
api.get('/bookmark', (req, res) => {
    let title = req.query.title;
    if (!title) {
        res.statusMessage = "Please send the 'title' as parameter";
        return res.status(406).end();
    }
    return BookmarkCrud.bookmarkTitle(title)
        .then(bookmarks => {
            if (bookmarks.length === 0) {
                return res.status(400).end();
            }
            return res.status(200).json(bookmarks)
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later";
            return res.status(500).end();
        });
});

//Post Endpoint
api.post('/bookmarks', jsonParser, (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if (!title || !description || !url || !rating) {
        res.statusMessage = "A parameter is missing in the request: 'title', 'description', 'url', or 'rating'";
        return res.status(406).end();
    }
    if (typeof (rating) !== 'number') {
        res.statusMessage = "The rating must be a number";
        return res.status(409).end();
    }
    let bookmark = {
        id: uuid.v4(),
        title: title,
        description: description,
        url: url,
        rating: rating
    }
    return BookmarkCrud.postbookmark(bookmark)
        .then(newBookmark => res.status(201).json(newBookmark))
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later";
            return res.status(500).end();
        });
});

// Delete Endpoint
api.delete('/bookmark/:id', (req, res) => {
    let { id } = req.params;
    BookmarkCrud.delBookmarkId(id)
        .then(bookmark => {
            if (!bookmark) {
                res.statusMessage = "The bookmark does not exist";
                res.status(404).send();
            }
            return res.status(200).end();
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later";
            return res.status(500).end();
        });
});

api.patch('/bookmark/:id', jsonParser, (req, res) => {
    let bodyId = req.body.id;
    let parmId = req.params.id
    let { title, description, url, rating } = req.body;
    if (!bodyId) {
        res.statusMessage = "Id of bookmark is missing";
        return res.status(406).end();
    }
    if (bodyId !== parmId) {
        res.statusMessage = "Id in the body does not match the Id in the parameters";
        return res.status(409).end();
    }
    if (!title && !description && !url && !rating) {
        res.statusMessage = "Empty body";
        return res.status(406).send();
    }

    let bookmark = {};
    if (title) bookmark.title = title;
    if (description) bookmark.description = description;
    if (url) bookmark.url = url;
    if (rating) bookmark.rating = rating;
    return BookmarkCrud.patchBookmarkId(parmId, bookmark)
        .then(updatedBookmark => {
            if (!updatedBookmark) {
                res.statusMessage = "The id does not match with any bookmark";
                return res.status(404).end;
            }
            res.statusMessage = "Bookmark updated with success";
            return res.status(202).json(updatedBookmark);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later";
            return res.status(500).end();
        });
});


api.listen(PORT, function () {
    console.log("Server is running at port 8080")
    new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }, (err) => {
            if (err) {
                reject(err);
            }
            else {
                console.log("bookmarksdb connected successfully")
                resolve();
            }
        })
    })
        .catch(err => {
            mongoose.disconnect();
            console.log(err);
        });

});
// mongodb + srv://AlphaFraser:Fraser21@@cluster0-v0oyl.mongodb.net/bookmarksdb?retryWrites=true&w=majority