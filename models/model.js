const mongoose = require('mongoose');
const uuid = require('uuid');

// mongoose.Promise = global.Promise;

const bookmarkSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true, default: () => uuid.v4() },
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    rating: { type: Number, required: true }
});

const BookmarkCollection = mongoose.model('bookmarks', bookmarkSchema);

let BookmarkCrud = {
    //query to create a new bookmark
    postbookmark: function (newBookmark) {
        return BookmarkCollection.create(newBookmark)
            .then(createdBookmark => { return createdBookmark; })
            .catch(err => { return err; });
    },

    //query to show all the bookmarks in the DB 
    allBookmarks: function () {
        return BookmarkCollection
            .find()
            .then(bookmarks => bookmarks)
            .catch(err => { return err })
    },
    //query to show a result searching with title
    bookmarkTitle: function (title) {
        let filter = { title: title }
        return BookmarkCollection
            .find(filter)
            .then(bookmarks => bookmarks)
            .catch(err => { return err })
    },
    //query to delete a bookmark by id
    delBookmarkId: function (id) {
        let filter = { id: id }
        return BookmarkCollection
            .deleteOne(filter)
            .then(data => data)
            .catch(err => { return err })
    },
    //query to patch a bookmark by id
    patchBookmarkId: function (id, info) {
        let filter = { id: id }
        return BookmarkCollection
            .findOneAndUpdate((filter), info, { new: true })
            .then(bookmark => bookmark)
            .catch(err => { return err })
    }
}

module.exports = { BookmarkCrud };