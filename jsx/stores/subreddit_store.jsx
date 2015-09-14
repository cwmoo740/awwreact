var Fluxxor = require("fluxxor");
var actions = require("../actions.jsx");
var $ = require('jquery');

var re = new RegExp(".com(?:/)([0-9A-Za-z]+)/?$");

var SubRedditStore = Fluxxor.createStore({
    initialize: function () {
        this.photos = {};
        this.image_keys = {};
        this.loaded = false;
        this.subredditLoaded = true;
        this.lastPosting = {};

        window.addEventListener('hashchange', function () {
            $(window).scrollTop(0);
            this.emit("change");
        }.bind(this));

        this.bindActions(
            actions.constants.SUBREDDIT.LOAD, this.beginLoadSubreddit,
            actions.constants.SUBREDDIT.LOAD_SUCCESS, this.loadSubredditSuccess,
            actions.constants.SUBREDDIT.LOAD_MORE, this.beginLoadSubreddit,
            actions.constants.SUBREDDIT.LOAD_MORE_SUCCESS, this.loadMore,
            actions.constants.SUBREDDIT.IMAGES_LOADED, this.imagesDoneLoading
        );
    },
    beginLoadSubreddit: function () {
        this.subredditLoaded = false;
        this.emit("change");
    },
    appendResults: function (data, key) {
        data.children.forEach(function (post) {
            if (post.data.domain === 'imgur.com') {
                var match = post.data.url.match(re);
                if (match !== null && !this.image_keys.hasOwnProperty(post.data.name)) {
                    this.photos[key].push({
                        photo: match[1],
                        title: post.data.title,
                        id: post.data.name
                    });
                    this.image_keys[post.data.name] = true;
                }
            }
        }, this);
        if (data.children.length > 0) {
            this.lastPosting[key] = data.children[data.children.length - 1].data.name;
        }
        console.log("Done appending: ", this.photos[key]);
        this.loaded = false;
        this.subredditLoaded = true;
        this.emit("change");
    },
    loadSubredditSuccess: function (payload) {
        var key = payload.subreddit;
        this.photos[key] = [];
        if (!payload.data) {
            this.loaded = true;
            this.emit("change");
            return;
        }
        this.appendResults(payload.data, key);
    },
    loadMore: function (payload) {
        var key = payload.subreddit;
        if (!payload.data) {
            this.loaded = true;
            this.emit("change");
            return;
        }
        this.appendResults(payload.data, key);
    },
    getPhotos: function (subreddit) {
        if (this.photos.hasOwnProperty(subreddit)) {
            return this.photos[subreddit];
        }
        else {
            return null;
        }
    },
    imagesDoneLoading: function () {
        this.loaded = true;
        this.emit("change");
    },
    imagesLoaded: function () {
        return this.loaded;
    },
    getLastPosting: function (subreddit) {
        return this.lastPosting[subreddit];
    },
    isSubredditLoaded: function () {
        return this.subredditLoaded;
    }
});

module.exports = SubRedditStore;